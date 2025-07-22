// src\utils\working\generateResponse.ts
import { generateBookResponse } from "../responses/bookResponse";
import { generateGreetingResponse } from "../responses/greetingResponse";
import { generateOrderStatusResponse } from "../responses/orderStatusResponse";
import { AnalysisResult } from "../../types/generateResponse";
import {} from "../../types/analyzeIntent";

export const generateResponse = async ({
  intent,
  sessionId,
  confidence,
  userText,
  imageText,
  contentType,
  data,
  from,
}: AnalysisResult): Promise<string> => {
  if (intent === "book_inquiry" && confidence > 0.7 && contentType === "book") {
    return await generateBookResponse(data, sessionId, userText);
  }

  if (
    intent === "order_status" &&
    confidence > 0.7 &&
    contentType === "receipt"
  ) {
    return await generateOrderStatusResponse(data, sessionId, userText);
  }

  if (intent === "complaint" && confidence > 0.7) {
    return `😔 I'm sorry to hear that. Can you please share more details so we can resolve it quickly?`;
  }

  if (intent === "general_help") {
    return await generateGreetingResponse(userText, sessionId);
  }

  return `🤖 Thanks for your message! We'll get back to you shortly.`;
};
