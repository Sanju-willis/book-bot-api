// src/utils/responses/orderStatusResponse.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  getLangChainMemory,
  saveLangChainMemory,
} from "../working/langchainMemoryStore";
import { findOrderById } from "./services/orderService";

// Regex to re-extract order ID from latest user input
const extractOrderIdFromText = (text: string): string | null => {
  const match = text.match(/\b[A-Z0-9]{5,}\b/i); // Adjust pattern if needed
  return match ? match[0] : null;
};

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
});

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

export const generateOrderStatusResponse = async (
  data: any,
  sessionId: string,
  userText: string
): Promise<string> => {
  let { order_id = "" } = data || {};
  const memory = await createMemory(sessionId);

  console.log("📦 [generateOrderStatusResponse] Input:", { sessionId, order_id, userText });

  let order = null;

  // 1st lookup
  if (order_id) {
    console.log(`🔍 Searching for order ID: ${order_id}`);
    order = await findOrderById(order_id);
  }

  // If not found, re-parse user text
  if (!order) {
    console.warn(`❌ Order not found for ID: ${order_id}`);
    const fallbackId = extractOrderIdFromText(userText);
    if (fallbackId && fallbackId !== order_id) {
      console.log(`🔁 Retrying with extracted ID from message: ${fallbackId}`);
      order_id = fallbackId;
      order = await findOrderById(order_id);
    }
  }

  // Still not found
  if (!order) {
    return `❌ Sorry, I couldn't find an order with ID *${order_id}*. Please double-check the number.`;
  }

  // Found
  const orderStatusContext = `Order ID: ${order.orderId}, Book: ${order.bookTitle}, Customer: ${order.customerName}, Status: ${order.status}`;
  const enrichedInput = `${userText}\n\n${orderStatusContext}`;

  const prompt = PromptTemplate.fromTemplate(`
You're a friendly assistant helping customers check their book order status.

Use the available order details. If it's already been discussed, follow up naturally instead of repeating the same message.

Chat History:
{chat_history}

User Message:
{input}

Assistant:
  `);

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
    : `📦 Checking order *#${order_id}*...`;
};
