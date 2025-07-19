// src\utils\chatBotChain.ts
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

// 🧠 Memory setup (in-memory for now)
const memoryStore = new Map<string, ChatMessageHistory>();

// 💬 Prompt setup
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful book assistant. Help the user however you can."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// 🤖 Model setup
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
});

// 🪄 Chain with memory
export const chatBotChain = new RunnableWithMessageHistory({
  runnable: prompt.pipe(model),
  
  getMessageHistory: async (sessionId: string) => {
    if (!memoryStore.has(sessionId)) {
      memoryStore.set(sessionId, new ChatMessageHistory());
    }
    return memoryStore.get(sessionId)!;
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});
