// src\services\whatsappService.ts
import axios from "axios";
import { PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } from "../config/env";
import { IncomingWhatsappMessage } from "../types/whatsapp";
import { analyzeMessage } from "../utils/analyzeMessage";
import { generateResponse } from "../utils/generateResponse";

export const handleIncomingMessages = async (
  message: IncomingWhatsappMessage
) => {
  const {
    from,
    text,
    mediaType,
    mediaId,
    name,
    timestamp,
    inputType,
    imageText,
  } = message;

  console.log("📩 WhatsApp message received:", {
    from,
    name,
    imageText,
    type: mediaType || "text",
    text,
    mediaId,
    timestamp,
    inputType,
  });

  // Analyze message with AI
  const analysis = await analyzeMessage({
    userText: text || "",
    imageText: imageText || "",
  });

  const { intent, confidence, content_type, data } = analysis;
  console.log("🧠 AI Analysis:", { intent, confidence, content_type, data });

 const normalizedContentType =
  content_type === "text_only" ? "text" : content_type;

const responseText = await generateResponse({
  intent,
  confidence,
  userText: text || "",
  imageText: imageText || "",
  contentType: normalizedContentType as any, // or fix type union properly
  data,
});


  // Send reply via WhatsApp
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: responseText,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Auto-reply sent");
  } catch (error: any) {
    console.error(
      "❌ Failed to send reply:",
      error?.response?.data || error.message
    );
  }
};
