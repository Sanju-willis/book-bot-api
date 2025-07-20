// src/handlers/intent/handleBookInquiryWithMemory.ts
import { extractBookData } from "../../utils/openaiService";
import { findBookInInventory } from "../../services/bookInventoryService";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";

// Create a memory instance per user (switch to Redis later)
const userMemoryMap = new Map<string, BufferMemory>();

const getMemoryForUser = (userId: string) => {
  if (!userMemoryMap.has(userId)) {
    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    });
    userMemoryMap.set(userId, memory);
  }
  return userMemoryMap.get(userId)!;
};

export const handleBookInquiryWithMemory = async (
  userId: string,
  message: string,
  imageText: string
) => {
  const inputText = message || imageText;
  const { title, author } = await extractBookData(inputText);

  if (!title) {
    return {
      response: `❌ I couldn't identify the book. Could you type the title?`,
      result: null,
    };
  }

  const memory = getMemoryForUser(userId);

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
  });

  const chain = new ConversationChain({
    llm: model,
    memory,
  });

  // Save user message to memory context
  await chain.call({ input: `User asked for: ${title} by ${author}` });

  const book = await findBookInInventory(title, author);

  if (!book) {
    return {
      response: `❌ Sorry, *${title}* by ${author} isn't in stock.`,
      result: { title, author, available: false },
    };
  }

  return {
    response: `📗 Yes! *${book.title}* by ${book.author} is available — Rs. ${book.price}`,
    result: { ...book, available: true },
  };
};
