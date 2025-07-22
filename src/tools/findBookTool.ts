import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { findBookInInventory } from "@/services/bookInventoryService";

export const findBookTool = new DynamicStructuredTool({
  name: "findBookTool",
  description: "Find book info by title, author, publisher, or ISBN",
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    publisher: z.string().optional(),
    isbn: z.string().optional(),
  }),
  func: async ({ title, author, publisher, isbn }) => {
    const book = await findBookInInventory(title, author, publisher, isbn);
    if (!book) return `❌ No book found with title: "${title}"`;
    return `📗 "${book.title}" by ${book.author} — Rs.${book.price} (${book.stock} in stock)`;
  },
});
