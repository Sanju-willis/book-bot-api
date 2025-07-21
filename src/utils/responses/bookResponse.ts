// src\utils\responses\bookResponse.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  getLangChainMemory,
  saveLangChainMemory,
} from "../working/langchainMemoryStore";
import { findBookInInventory } from "../../services/bookInventoryService";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
});

const prompt = PromptTemplate.fromTemplate(`
You're a helpful bookstore assistant.

Your job is to answer questions and help users about books using the provided context.

Keep the conversation friendly and brief. If you've already answered a question about this book, follow up naturally without repeating.

Chat History:
{chat_history}

User Message:
{input}

Assistant:
`);

const createMemory = async (sessionId: string) => {
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
  });

  const previousMessages = getLangChainMemory(sessionId);
  if (previousMessages) {
    await memory.chatHistory.addMessages(previousMessages);
  }

  return memory;
};

export const generateBookResponse = async (
  data: any,
  sessionId: string,
  userText: string
): Promise<string> => {
  const { title = "", author = "" } = data || {};
  console.log("📘 [generateBookResponse] Data:", {
    sessionId,
    title,
    author,
    userText,
  });

  if (!title && !author) {
    return "❓ I couldn't extract the book title. Could you type it manually?";
  }

  const memory = await createMemory(sessionId);
  let bookInfo = `Book: "${title}" by ${author}`;

  // 🔍 Try DB lookup
  const book = await findBookInInventory(title, author);
  if (book) {
    return `📘 *${book.title}* by ${book.author} is available — Rs.${book.price}. (${book.stock} in stock)`;
  }

  const enrichedInput = `${userText}\n\n${bookInfo}`;

  try {
    const chain = new ConversationChain({
      llm: model,
      memory,
      prompt,
    });

    const result = await chain.call({ input: enrichedInput });

    const updatedMessages = await memory.chatHistory.getMessages();
    saveLangChainMemory(sessionId, updatedMessages);

    return typeof result.response === "string"
      ? result.response.trim()
      : "🤖 Got your request. Checking availability...";
  } catch (err) {
    console.error("❌ [generateBookResponse] LangChain error:", err);
    return "⚠️ Something went wrong while checking the book. Please try again.";
  }
};
