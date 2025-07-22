import { analyzeMessage } from "../utils/working/analyzeIntent";
import { generateResponse } from "../utils/working/generateResponse";
import { getOrCreateSessionId } from "../utils/working/sessionManager";
import {
  saveSessionData,
  getSessionData,
} from "../utils/working/sessionMemory";
import { sendWhatsAppReply } from "./reply/whatsappReplyService";
import { IncomingMessage } from "../types/processService";

export const handleIncomingMessages = async ({
  user,
  message,
}: IncomingMessage) => {
  const { from, name } = user;
  const { msgType, text, extractedText, mediaId, timestamp, messageId } =
    message;

  const sessionId = await getOrCreateSessionId(from, timestamp);
  console.log("🪪 Session ID:", sessionId);

  const existingData = getSessionData(sessionId);
  const isFollowUp =
    existingData &&
    text &&
    !text.toLowerCase().includes("book") &&
    !text.toLowerCase().includes("new");

  if (isFollowUp) {
    console.log("↩️ Detected follow-up, skipping intent analysis");
    const responseText = await generateResponse({
      sessionId,
      from,
      intent: existingData.intent,
      confidence: 1,
      userText: text,
      imageText: "",
      contentType: existingData.contentType,
      data: existingData.data,
    });

    return await sendWhatsAppReply(from, responseText);
  }

  // ✅ Run analysis first
  const analysis = await analyzeMessage({
    userText: text,
    extractedText, // optional: rename from imageText for clarity
    msgType, // "text", "image", "audio", "video", etc.
  });

  const { intent, confidence, content_type, data } = analysis;

  saveSessionData(sessionId, {
    intent,
    contentType: content_type,
    data,
  });

  const responseText = await generateResponse({
    sessionId,
    from,
    intent,
    confidence,
    userText: text,
    imageText: "",
    contentType: content_type,
    data,
  });

  await sendWhatsAppReply(from, responseText);
  return responseText;
};
