// src\utils\working\analyzeMessage.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

const prompt = PromptTemplate.fromTemplate(`
You are a message analyzer. Based on the user's message and any image text provided:

1. Detect the user's intent.
2. Identify the content type: "book", "receipt", "text_only", or "other".
3. Extract structured data based on the content.

Respond ONLY in raw JSON format, like:

{{
  "intent": "book_inquiry" | "order_status" | "complaint" | "greeting" | "smalltalk" | "goodbye" | "unknown",
  "confidence": float (0 to 1),
  "content_type": "book" | "receipt" | "text_only" | "other",
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

User typed message:
"{userText}"

Text extracted from image:
"{imageText}"
`);

const chain = prompt.pipe(model).pipe(new JsonOutputParser());

export type AnalyzeResult = {
  intent:
    | "book_inquiry"
    | "order_status"
    | "complaint"
    | "greeting"
    | "goodbye"
    | "unknown";
  confidence: number;
  content_type: "book" | "receipt" | "text_only" | "unknown";
  data: Record<string, any>;
};

type AnalyzeInput = {
  userText: string;
  imageText?: string;
};

export const analyzeMessage = async ({
  userText,
  imageText = "",
}: AnalyzeInput): Promise<AnalyzeResult> => {
  try {
    console.log("🔍 Analyzing message:", { userText, imageText });

    const result = await chain.invoke({ userText, imageText });

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
