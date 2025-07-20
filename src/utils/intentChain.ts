// src\utils\intentChain.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// AI model (adjust if needed)
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

// Prompt with separate inputs
const prompt = PromptTemplate.fromTemplate(`
You are an intent classifier. Use the inputs below to determine the user's intent.

User typed message:
"{userText}"

Text extracted from image (if any):
"{imageText}"

Classify into one of the following intents:
- book_inquiry
- order_status
- complaint
- greeting
- smalltalk
- goodbye
- unknown

Respond only in raw JSON format:
{{"intent": "one of the above", "confidence": number between 0 and 1}}
`);

// Chain: prompt → model → JSON parser
const chain = prompt.pipe(model).pipe(new JsonOutputParser());

// Intent input structure
type IntentInput = {
  userText: string;
  imageText?: string;
};

// Exported detection function
export const detectIntent = async ({
  userText,
  imageText = "",
}: IntentInput) => {
  try {
    console.log("🔍 Detecting intent for:", { userText, imageText });

    const result = await chain.invoke({ userText, imageText });

    console.log("✅ Intent detected:", result);
    return result as {
      intent:
        | "book_inquiry"
        | "order_status"
        | "complaint"
        | "greeting"
        | "smalltalk"
        | "goodbye"
        | "unknown";
      confidence: number;
    };
  } catch (error) {
    console.error("❌ Intent detection failed:", error);

    return {
      intent: "unknown" as const,
      confidence: 0.5,
    };
  }
};
