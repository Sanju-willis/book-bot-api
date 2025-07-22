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
  platform,
  user,
  message,
}: IncomingMessage) => {
  const { from, name } = user;
  const { msgType, text, extractedText, timestamp } = message;

  const mergedText = text;
  const sessionId = await getOrCreateSessionId(from, timestamp);
  console.log("🪪 Session ID:", sessionId);

  const existingData = getSessionData(sessionId);
  const isFollowUp = existingData && mergedText && mergedText.length < 30;

  if (isFollowUp) {
    console.log("↩️ Detected follow-up, skipping intent analysis");

    const responseText = await generateResponse({
      sessionId,
      from,
      intent: existingData.intent,
      confidence: 1,
      userText: mergedText,
      imageText: extractedText || "",
      contentType: existingData.contentType,
      data: existingData.data,
    });

    return await sendWhatsAppReply(from, responseText);
  }

  // ✅ Run AI analysis
  const analysis = await analyzeMessage({
    msgType,
    userText: mergedText,
    extractedText,
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
    userText: mergedText,
    imageText: extractedText || "",
    contentType: content_type,
    data,
  });

  await sendWhatsAppReply(from, responseText);
  return responseText;
};
