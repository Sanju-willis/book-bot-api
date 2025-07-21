// src\utils\responses\services\bookInventoryService.ts
// src/services/bookInventoryService.ts
import { db } from "../../../db";
import { books } from "../../../db/schema/books";
import { eq, and } from "drizzle-orm";

export const findBookInInventory = async (title: string, author: string) => {
  try {
    const result = await db
      .select()
      .from(books)
      .where(and(eq(books.title, title), eq(books.author, author)))
      .limit(1);

    return result[0] || null;
  } catch (err) {
    console.error("❌ [findBookInInventory] DB error:", err);
    return null;
  }
};
