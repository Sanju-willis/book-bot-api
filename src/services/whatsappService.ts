// src\services\whatsappService.ts
import { IncomingWhatsappMessage } from "../types/whatsapp";
import { analyzeMessage } from "../utils/working/analyzeMessage";
import { generateResponse } from "../utils/working/generateResponse";
import { getOrCreateSessionId } from "../utils/working/sessionManager";
import { sendWhatsAppReply } from "../utils/helpersReply/sendWhatsAppReply";
import {
  saveSessionData,
  getSessionData,
  clearSessionData,
} from "../utils/working/sessionMemory";

export const handleIncomingMessages = async (
  message: IncomingWhatsappMessage
) => {
  const {
    from,
    name,
    msgText,
    mediaType,
    mediaId,
    timestamp,
    inputType,
    imageText,
  } = message;

  

  const sessionId = await getOrCreateSessionId(from, timestamp);
  console.log("🪪 Session ID:", sessionId);

  // 🧠 Step 2: Check existing session context
  const existingData = getSessionData(sessionId);

  const isFollowUp =
    existingData &&
    msgText &&
    !msgText.toLowerCase().includes("book") &&
    !msgText.toLowerCase().includes("new");

  if (isFollowUp) {
    console.log("↩️ Detected follow-up, skipping analysis...");
    const responseText = await generateResponse({
      sessionId,
      from,
      intent: existingData.intent,
      confidence: 1,
      userText: msgText || "",
      imageText: imageText || "",
      contentType: existingData.contentType,
      data: existingData.data,
    });

    return await sendWhatsAppReply(from, responseText);
  }
  // Analyze message with AI
  const analysis = await analyzeMessage({
    userText: msgText || "",
    imageText: imageText || "",
  });

  const { intent, confidence, content_type, data } = analysis;
  console.log("🧠 AI Analysis:", { intent, confidence, content_type, data });

  const normalizedContentType =
    content_type === "text_only" ? "text" : content_type;

  // 💾 Step 4: Save context if it's a book or something trackable

  saveSessionData(sessionId, {
    intent,
    contentType: content_type, // already valid
    data,
  });

  const responseText = await generateResponse({
    sessionId,
    from,
    intent,
    confidence,
    userText: msgText || "",
    imageText: imageText || "",
    contentType: normalizedContentType as any, // or fix type union properly
    data,
  });

  // Send reply via WhatsApp
  await sendWhatsAppReply(from, responseText);
};
