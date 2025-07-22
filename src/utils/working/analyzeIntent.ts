import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { AnalyzeInput, AnalyzeResult } from "../../types/analyzeIntent";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

// 🧠 Prompt includes msgType now
const prompt = PromptTemplate.fromTemplate(`
You are a message analyzer. Based on the user's message, message type, and any extracted text (from image/audio/video):

1. Detect the user's intent.
2. Identify the content type: "book", "receipt", "text_only", or "other".
3. Extract structured data based on the content.

Respond ONLY in raw JSON format, like:

{{
  "intent": "book_inquiry" | "order_status" | "complaint" | "greeting" | "smalltalk" | "goodbye" | "unknown",
  "confidence": float (0 to 1),
  "content_type": "book" | "receipt" | "text_only" | "unknown",
  "data": {{
    // If book:
    "title": "string",
    "author": "string",
    "publisher": "string (optional)",
    "isbn": "string (optional)"

    // If receipt:
    "order_id": "string",
    "date": "YYYY-MM-DD",
    "total": "Rs. amount",
    "items": ["item name", "item name", ...] (optional)
  }}
}}

Message type:
"{msgType}"

User typed message or caption:
"{userText}"

Extracted content (e.g. from image, audio, or video):
"{extractedText}"
`);

const chain = prompt.pipe(model).pipe(new JsonOutputParser());




export const analyzeMessage = async ({
  userText,
  extractedText = "",
  msgType,
}: AnalyzeInput): Promise<AnalyzeResult> => {
  try {
    console.log("🔍 Analyzing message:", { userText, extractedText, msgType });

    const result = await chain.invoke({ userText, extractedText, msgType });

    console.log("✅ Analysis result:", result);

    return result as AnalyzeResult;
  } catch (err) {
    console.error("❌ analyzeMessage failed:", err);
    return {
      intent: "unknown",
      confidence: 0,
      content_type: "unknown",
      data: {},
    };
  }
};
