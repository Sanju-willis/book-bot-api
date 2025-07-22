import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";

import { createChatMemory, persistChatMemory } from "./helpers/messageMemory";
import { extractOrderIdFromText } from "./helpers/textExtractors";
import { findOrderById } from "./services/orderService";
import { chatModel } from "@/config/model";

export const generateOrderStatusResponse = async (
  data: any,
  sessionId: string,
  userText: string
): Promise<string> => {
  let { order_id = "" } = data || {};
  const memory = await createChatMemory(sessionId);

  console.log("📦 [generateOrderStatusResponse] Input:", {
    sessionId,
    order_id,
    userText,
  });

  let order = null;

  // 1st lookup
  if (order_id) {
    console.log(`🔍 Searching for order ID: ${order_id}`);
    order = await findOrderById(order_id);
  }

  // Retry using extracted text
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
    llm: chatModel,
    memory,
    prompt,
  });

  const result = await chain.call({ input: enrichedInput });

  await persistChatMemory(sessionId, memory);

  return typeof result.response === "string"
    ? result.response.trim()
    : `📦 Checking order *#${order_id}*...`;
};
