// src\utils\intenttChain.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// 🔁 LLM setup
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

// 🧠 Prompt setup
const prompt = PromptTemplate.fromTemplate(`
You are an intent classifier for a bookshop assistant.

Classify the customer's request into one of the following intents:

- "book_inquiry"     → If they are asking about a book's availability, price, or edition
- "order_status"     → If they are asking about their order, delivery, or tracking
- "complaint"        → If they are complaining about a wrong or failed delivery
- "other"            → For all other general questions

Input:
{{
  "message": "{message}",
  "imageText": "{imageText}"
}}

Only respond in raw JSON like this:
{{ "intent": "book_inquiry", "confidence": 0.95 }}
`);


// 🔗 Chain
const chain = prompt.pipe(model).pipe(new JsonOutputParser());

const greetingRegex = /^(hi|hello|hey|good (morning|evening|afternoon))\b/i;

export const detectIntent = async (input: {
  message: string;
  imageText: string;
}): Promise<{ intent: string; confidence: number }> => {
  const trimmed = input.message.trim().toLowerCase();

  // ✅ Step 1: Check if it's a greeting
  if (greetingRegex.test(trimmed)) {
    console.log(`[Intent Detection] Greeting detected → "greeting"`);
    return { intent: "greeting", confidence: 1 };
  }

  // ✅ Step 2: Else fallback to GPT-powered intent detection
  const result = await chain.invoke(input);

  const { intent, confidence } = result as {
    intent: "book_inquiry" | "order_status" | "complaint" | "other";
    confidence: number;
  };

  console.log(`[Intent Detection] "${input.message}" + [image] → ${intent} (${confidence})`);
  return { intent, confidence };
};
