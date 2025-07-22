
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

export const generalHelpTool = new DynamicStructuredTool({
  name: "generalHelpTool",
  description: "Provide general help or greeting for the bookstore assistant",
  schema: z.object({
    message: z.string().describe("User's help message or greeting"),
  }),
  func: async ({ message }) => {
    return `👋 Hi there! I'm your bookstore assistant. You can ask me about books, orders, or anything else.`;
  },
});
