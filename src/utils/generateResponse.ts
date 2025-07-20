// src\utils\generateResponse.ts
import { generateBookResponse } from "./responses/bookResponse"; // adjust path if needed

type Intent =
  | "book_inquiry"
  | "order_status"
  | "complaint"
  | "greeting"
  | "smalltalk"
  | "goodbye"
  | "unknown";

type ContentType = "book" | "receipt" | "text_only" | "unknown"; // update enum

interface AnalysisResult {
  intent: Intent;
  confidence: number;
  userText: string;
  imageText: string;
  contentType?: ContentType;
  data?: any;
}

export const generateResponse =async  ({
  intent,
  confidence,
  userText,
  imageText,
  contentType,
  data,
}: AnalysisResult):Promise<string> => {
  if (intent === "book_inquiry" && confidence > 0.7 && contentType === "book") {
  return await generateBookResponse(data);
}


  if (intent === "order_status" && confidence > 0.7 && contentType === "receipt") {
    const { order_id, date, total } = data || {};
    if (order_id) {
      return `📦 Checking order *#${order_id}*${date ? ` placed on ${date}` : ""}...`;
    } else {
      return `❓ I couldn't find an order ID. Please provide it so I can check the status.`;
    }
  }

  if (intent === "complaint" && confidence > 0.7) {
    return `😔 I'm sorry to hear that. Can you please share more details so we can resolve it quickly?`;
  }

  if (intent === "greeting") {
    return `👋 Hi there! How can I assist you today?`;
  }

  if (intent === "smalltalk") {
    return `🙂 Nice chatting with you! Let me know if you need help with something.`;
  }

  if (intent === "goodbye") {
    return `👋 Take care! Let us know if you need anything later.`;
  }

  return `🤖 Thanks for your message! We'll get back to you shortly.`;
};
