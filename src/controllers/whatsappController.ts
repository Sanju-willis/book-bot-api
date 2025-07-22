// src\controllers\whatsappController.ts
import { Request, Response } from "express";
import { handleIncomingMessages } from "../services/messageProcessor";
import { parseWhatsappMessages } from "../utils/parsers/whatsappParser";
import { WHATSAPP_VERIFY_TOKEN } from "../config/env";
import { extractImageText } from "../utils/transcription/visionService";
import { extractAudioText } from "../utils/transcription/extractAudioText";
import { extractVideoText } from "../utils/transcription/extractVideoText";

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

const processedMessageIds = new Set<string>();

export const receiveMessage = async (req: Request, res: Response) => {
  const body = req.body;
  const parsed = parseWhatsappMessages(body);
  console.log("📦 Parsed WhatsApp Messages:", JSON.stringify(parsed, null, 2));

  if (parsed.length === 0) {
    res.sendStatus(200);
    return;
  }

  for (const msg of parsed) {
    const { user, message } = msg;
    const { from, name } = user;

    // ✅ Extract full fields safely
    const {
      msgType,
      text,
      caption,
      mediaId,
      image,
      audio,
      video,
      timestamp,
      messageId,
    } = message;

    const type = msgType;
    const resolvedMediaId = mediaId || image || audio || video;
    const userText = text?.trim() || caption?.trim() || "";

    if (processedMessageIds.has(messageId)) {
      console.log("⚠️ Duplicate message ID, skipping:", messageId);
      continue;
    }

    processedMessageIds.add(messageId);

    let extractedText = "";

    try {
      if (type === "image" && resolvedMediaId) {
        console.log("📷 Calling extractImageText with:", resolvedMediaId);
        extractedText = await extractImageText(resolvedMediaId);
        console.log("🧠 Extracted image text:", extractedText);
      } else if (type === "audio" && resolvedMediaId) {
        console.log("🎤 Calling extractAudioText with:", resolvedMediaId);
        extractedText = await extractAudioText(resolvedMediaId);
        console.log("🧠 Extracted audio text:", extractedText);
      } else if (type === "video" && resolvedMediaId) {
        console.log("🎞️ Calling extractVideoText with:", resolvedMediaId);
        extractedText = await extractVideoText(resolvedMediaId);
        console.log("🧠 Extracted video text:", extractedText);
      } else {
        console.log("⚠️ No extractor matched for:", { type, resolvedMediaId });
      }
    } catch (err) {
      console.warn(`⚠️ Failed to extract ${type} content:`, err);
    }

    await handleIncomingMessages({
      platform: "whatsapp",
      user: { from, name },
      message: {
        msgType: type,
        text: userText,
        extractedText: extractedText || "",
        mediaId,
        timestamp,
        messageId,
      },
    });
  }

  res.sendStatus(200);
};
