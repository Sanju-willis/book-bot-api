// src\utils\getChatBotChain.ts
// src/utils/getChatBotChain.ts
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const memoryStore = new Map<string, ChatMessageHistory>();

export const getChatBotChain = (intent: string) => {
  // 🎯 Customize prompt and model per intent
  let systemPrompt = "You are a helpful assistant.";
  let modelName = "gpt-4o";
  let temperature = 0.7;

  switch (intent) {
    case "book_inquiry":
      systemPrompt =
        "You are a book expert. Help the user find books based on title, author, or image.";
      break;
    case "order_status":
      systemPrompt =
        "You are a support agent helping users track their book orders.";
      break;
    case "complaint":
      systemPrompt =
        "You are a calm and apologetic assistant handling user complaints empathetically.";
      temperature = 0.3; // more stable tone
      break;
    default:
      systemPrompt = "You are a helpful general assistant.";
      break;
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const model = new ChatOpenAI({
    modelName,
    temperature,
  });

  return new RunnableWithMessageHistory({
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
};
