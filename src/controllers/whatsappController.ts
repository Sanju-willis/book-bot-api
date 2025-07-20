// src\controllers\whatsappController.ts
import { Request, Response } from "express";
import { handleIncomingMessages } from "../services/whatsappService";
import { parseWhatsappMessage } from "../utils/parseWhatsappMessage";
import { WHATSAPP_VERIFY_TOKEN } from "../config/env";
import { extractImageText } from "../utils/visionService";

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
  const parsed = parseWhatsappMessage(body);
  if (parsed.length === 0) {
    res.sendStatus(200);
    return;
  }

  for (const msg of parsed) {
    if (processedMessageIds.has(msg.messageId)) {
      console.log("⚠️ Duplicate message ID, skipping:", msg.messageId);
      continue;
    }

    //console.log("📨 Parsed Message:", msg);
    processedMessageIds.add(msg.messageId);
   // console.log("prase", parsed);

    let imageText = "";
    // 🧠 Conditional image text extraction
    if (msg.inputType === "image_only" || msg.inputType === "image_with_text") {
      if (msg.mediaId) {
        try {
          imageText = await extractImageText(msg.mediaId);
          console.log("🧠  image:", imageText);
        } catch (err) {
          console.warn("⚠️ Failed to extract image text:", err);
        }
      }
    }

    await handleIncomingMessages({
      from: msg.from,
      text: msg.text,
      imageText,
      mediaType: msg.mediaType,
      mediaId: msg.mediaId,
      name: msg.name,
      timestamp: msg.timestamp,
      inputType: msg.inputType,
    });
  }

  res.sendStatus(200);
};
