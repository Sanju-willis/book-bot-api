import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

// Replace this with real order lookup logic
const getOrderStatus = async ({ orderId }: { orderId: string }) => {
  // Fake status
  return `📦 Order ${orderId} is in transit and expected to arrive in 2 days.`;
};

export const orderStatusTool = new DynamicStructuredTool({
  name: "orderStatusTool",
  description: "Check the status of an order using its order ID",
  schema: z.object({
    orderId: z.string().describe("The order ID to check"),
  }),
  func: getOrderStatus,
});
