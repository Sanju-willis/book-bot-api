import { BufferMemory } from "langchain/memory";
import {
  getLangChainMemory,
  saveLangChainMemory,
} from "./langchainMemoryStore";

export const createChatMemory = async (
  sessionId: string,
  inputKey = "input",
  outputKey = "response"
): Promise<BufferMemory> => {
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey,
    outputKey,
  });

  const previousMessages = getLangChainMemory(sessionId);
  if (previousMessages) {
    await memory.chatHistory.addMessages(previousMessages);
  }

  return memory;
};

export const persistChatMemory = async (
  sessionId: string,
  memory: BufferMemory
) => {
  const updatedMessages = await memory.chatHistory.getMessages();
  saveLangChainMemory(sessionId, updatedMessages);
};
