import { generateBookResponse } from "@/agentss/bookResponse";
import { generateGreetingResponse } from "@/agentss/generalHelpResponse";
import { generateOrderStatusResponse } from "@/agentss/orderStatusResponse";
import { generateRecommendationResponse } from "@/agentss/recommendationResponse";
import { generateComplaintResponse } from "@/agentss/complaintResponse";

import { AnalysisResult } from "@/types/generateResponse";

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
  console.log("🧠 [generateResponse] Analysis Input:", {
    intent,
    confidence,
    contentType,
    sessionId,
    userText,
    imageText,
    data,
    from,
  });

  if (intent === "general_help") {
    console.log("💬 Routing to: generateGreetingResponse");
    return await generateGreetingResponse(userText, sessionId);
  }

  if (intent === "book_inquiry" && confidence > 0.7 ) {
    console.log("📘 Routing to: generateBookResponse");
    return await generateBookResponse(data, sessionId, userText);
  }

  if (intent === "order_status" && confidence > 0.7 ) {
    console.log("📦 Routing to: generateOrderStatusResponse");
    return await generateOrderStatusResponse(data, sessionId, userText);
  }

 if (intent === "complaint" && confidence > 0.7) {
    console.log("⚠️ Routing to: generateComplaintResponse");
    return await generateComplaintResponse(sessionId, userText);
  }

  if (intent === "recommend_book" && confidence > 0.7) {
    console.log("📚 Routing to: generateRecommendationResponse");
    return await generateRecommendationResponse(sessionId, userText);
  }

  console.log("🤖 No matching intent handler. Using fallback response.");
  return `🤖 Thanks for your message! We'll get back to you shortly.`;
};
