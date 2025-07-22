// src\utils\working\langchainMemoryStore.ts
import { BaseMessage } from "@langchain/core/messages";

const memoryMap = new Map<string, BaseMessage[]>();

export const getLangChainMemory = (sessionId: string): BaseMessage[] | undefined =>
  memoryMap.get(sessionId);

export const saveLangChainMemory = (sessionId: string, messages: BaseMessage[]) => {
  memoryMap.set(sessionId, messages);
};
