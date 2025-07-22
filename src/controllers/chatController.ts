// src\controllers\chatController.ts
import { Request, Response } from "express";
import { extractImageText } from "../utils/transcription/visionService";
import { handleIncomingMessages } from "../services/whatsappService";
import { AppError } from "../errors/Errors";

const processedMessageIds = new Set<string>();

export const handleChatMessages = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 Incoming request to /chat");
  console.log("🧾 Body:", req.body);

  const sessionId = req.body.sessionId as string;
  let messages = req.body.messages;

  // 🔁 Support fallback for single message format
  if (!messages && req.body.message) {
    messages = [
      {
        messageId: "msg_" + Date.now(),
        text: req.body.message,
        fileBuffer: null,
        fileType: null,
      },
    ];
  }

  if (!sessionId) {
    console.error("❌ Missing sessionId");
    res.status(400).json({ error: "Missing sessionId" });
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    console.warn("⚠️ No valid messages in request");
    res.status(400).json({ error: "No messages provided" });
    return;
  }

  const results = [];

  for (const msg of messages) {
    const {
      messageId,
      text,
      fileBuffer,
      fileType,
      mediaId = null,
      mediaType = fileType || "text",
      name = "user",
      timestamp = Date.now(),
    } = msg;

    console.log("🔄 Processing message:", { messageId, text });

    if (!messageId) {
      console.warn("⛔ Skipping message without ID");
      continue;
    }

    if (processedMessageIds.has(messageId)) {
      console.log("⚠️ Duplicate message ID, skipping:", messageId);
      continue;
    }

    processedMessageIds.add(messageId);

    let imageText = "";
    let inputType: "text_only" | "image_only" | "image_with_text" = "text_only";

    if (fileBuffer && fileType?.startsWith("image/")) {
      try {
        imageText = await extractImageText(fileBuffer);
        console.log("🧠 Extracted image text:", imageText);
        inputType = text ? "image_with_text" : "image_only";
      } catch (err) {
        console.error("❌ OCR failed:", err);
      }
    }

    const reply = await handleIncomingMessages({
      from: sessionId,
      msgText: text,
      imageText,
      mediaType,
      mediaId,
      name,
      timestamp,
      inputType,
    });

    console.log("✅ Reply from handleIncomingMessages:", reply);

    results.push({ messageId, reply });
  }

  console.log("📤 Sending replies:", results);
  res.json({ replies: results });
};
