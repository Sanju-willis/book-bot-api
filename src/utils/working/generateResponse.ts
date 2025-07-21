// src\utils\working\generateResponse.ts
import { generateBookResponse } from "../responses/bookResponse";
import { generateGreetingResponse } from "../responses/greetingResponse";
import { generateOrderStatusResponse } from "../responses/orderStatusResponse";

export type Intent =
  | "book_inquiry"
  | "order_status"
  | "complaint"
  | "greeting"
  | "smalltalk"
  | "goodbye"
  | "unknown";

export type ContentType =
  | "book"
  | "receipt"
  | "text_only"
  | "unknown"
  | "follow_up";

export interface AnalysisResult {
  intent: Intent;
  sessionId: string;
  confidence: number;
  userText: string;
  imageText: string;
  contentType?: ContentType;
  data?: any;
  from: string;
}

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

  if (intent === "greeting") {
    return await generateGreetingResponse(userText, sessionId);
  }

  if (intent === "smalltalk") {
    return `🙂 Nice chatting with you! Let me know if you need help with something.`;
  }

  if (intent === "goodbye") {
    return `👋 Take care! Let us know if you need anything later.`;
  }

  return `🤖 Thanks for your message! We'll get back to you shortly.`;
};
