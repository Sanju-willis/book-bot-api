// src\utils\responses\greetingResponse.ts
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  getLangChainMemory,
  saveLangChainMemory,
} from "./helpers/langchainMemoryStore";
import { chatModel } from "@/config/model";

const prompt = PromptTemplate.fromTemplate(`
You're a friendly AI assistant for a bookstore. When a user sends a greeting, reply warmly and briefly offer help.

User: {input}
Assistant:
`);

export const generateGreetingResponse = async (
  input: string,
  sessionId: string
): Promise<string> => {
  try {
    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    // 🧠 Load previous memory
    const previousMessages = getLangChainMemory(sessionId);
    if (previousMessages) {
      await memory.chatHistory.addMessages(previousMessages);
    }

    const chain = new ConversationChain({
      llm: chatModel,
      memory,
      prompt,
    });

    const result = await chain.call({ input });

    const updatedMessages = await memory.chatHistory.getMessages();
    console.log("🧠 BufferMemory (LangChain) messages:", updatedMessages);

    // 💾 Save updated memory
    saveLangChainMemory(sessionId, updatedMessages);

    return typeof result.response === "string"
      ? result.response.trim()
      : "👋 Hi! How can I assist you today?";
  } catch (err) {
    console.error("❌ [generateGreetingResponse] Error:", err);
    return "👋 Hello! Let me know how I can help.";
  }
};
