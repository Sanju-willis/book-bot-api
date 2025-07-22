// src\controllers\whatsappController.ts
import { Request, Response } from "express";
import { handleIncomingMessages } from "../services/whatsappServices";
import { parseWhatsappMessages } from "../utils/parsers/parseWhatsapp";
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
  if (parsed.length === 0) {
    res.sendStatus(200);
    return;
  }

  for (const msg of parsed) {
    const { user, message } = msg;
    const { from, name } = user;
    const { type, text, mediaId, timestamp, messageId } = message;

    if (processedMessageIds.has(messageId)) {
      console.log("⚠️ Duplicate message ID, skipping:", messageId);
      continue;
    }

    processedMessageIds.add(messageId);

    let extractedText = "";

    try {
      if (type === "image" && mediaId) {
        extractedText = await extractImageText(mediaId);
        console.log("🧠 Extracted image text:", extractedText);
      } else if (type === "audio" && mediaId) {
        extractedText = await extractAudioText(mediaId);
        console.log("🧠 Extracted audio text:", extractedText);
      } else if (type === "video" && mediaId) {
        extractedText = await extractVideoText(mediaId);
        console.log("🧠 Extracted video text:", extractedText);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to extract ${type} content:`, err);
    }

    await handleIncomingMessages({
      user: { from, name },
      message: {
        msgType: type,
        text: text || "",
        extractedText: extractedText || "",
        mediaId,
        timestamp,
        messageId,
      },
    });
  }

  res.sendStatus(200);
};
