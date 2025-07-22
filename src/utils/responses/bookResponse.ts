import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory } from "langchain/memory";
import {
  detectBookIntentPrompt,
  bookFallbackPrompt,
} from "./prompts/bookPrompts";
import { chatModel } from "../../config/model";
import { createChatMemory, persistChatMemory } from "./helpers/messageMemory";
import { saveLangChainMemory } from "./helpers/langchainMemoryStore";
import { findBookInInventory } from "./services/bookInventoryService";

// 👁️ Detect intent
const detectBookIntent = async (
  userText: string
): Promise<"find_book" | "get_price" | "check_stock" | "unknown"> => {
  const intentChain = detectBookIntentPrompt.pipe(chatModel);

  try {
    const result = await intentChain.invoke({ input: userText });
    const intent = String(result?.content || "")
      .trim()
      .toLowerCase();

    if (
      intent === "find_book" ||
      intent === "get_price" ||
      intent === "check_stock"
    ) {
      return intent;
    }
    return "unknown";
  } catch {
    return "unknown";
  }
};

// 🧠 Extract last mentioned book from memory (for follow-ups)
const getLastBookMentioned = async (memory: BufferMemory) => {
  const messages = await memory.chatHistory.getMessages();
  const reversed = [...messages].reverse();

  for (const msg of reversed) {
    const content =
      typeof msg.content === "string" ? msg.content.toLowerCase() : "";
    const titleMatch = content.match(/(?:book|title)[\s:]*"?(.+?)"?[,\.]?/i);
    const authorMatch = content.match(/(?:author)[\s:]*"?(.+?)"?[,\.]?/i);

    if (titleMatch) {
      return {
        title: titleMatch[1].trim(),
        author: authorMatch?.[1]?.trim() || "",
      };
    }
  }

  return { title: "", author: "" };
};

// 🧠 Main response logic
export const generateBookResponse = async (
  data: any,
  sessionId: string,
  userText: string
): Promise<string> => {
  let { title = "", author = "" } = data || {};

  const memory = await createChatMemory(sessionId);
  const intent = await detectBookIntent(userText);

  console.log("🎯 Intent:", intent, "| Raw title:", title);

  if (!title) {
    const last = await getLastBookMentioned(memory);
    title = last.title;
    author = last.author;
    console.log("🧠 Used memory fallback:", { title, author });
  }

  if (!title && intent !== "find_book") {
    return "❓ Can you tell me the book title you're referring to?";
  }

  const book = await findBookInInventory(title, author);

  if (intent === "find_book") {
    return `📘 Got it! You're looking for *${title}*. Want to know the price or check availability?`;
  }

  if (intent === "get_price") {
    if (!book)
      return `❌ I couldn't find *${title}*. Could you double-check the title?`;
    return `💰 *${book.title}* is Rs.${book.price}.`;
  }

  if (intent === "check_stock") {
    if (!book)
      return `❌ I couldn't find *${title}*. Can you confirm the name?`;
    return book.stock > 0
      ? `📦 *${book.title}* is in stock — ${book.stock} copies left.`
      : `🚫 *${book.title}* is currently out of stock.`;
  }

  const fallbackChain = RunnableSequence.from([bookFallbackPrompt, chatModel]);

  try {
    const enrichedInput = userText;

    const result = await fallbackChain.invoke({
      input: enrichedInput,
      chat_history: await memory.chatHistory.getMessages(),
    });

    await memory.saveContext(
      { input: enrichedInput },
      { response: result.content || "" }
    );

    const updatedMessages = await memory.chatHistory.getMessages();
    saveLangChainMemory(sessionId, updatedMessages);

    return (
      String(result.content || "").trim() || "🤖 Got your message. Checking..."
    );
  } catch (err) {
    console.error("❌ Error generating fallback response:", err);
    return "⚠️ Something went wrong. Please try again.";
  }
};
