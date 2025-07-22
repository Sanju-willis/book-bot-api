// src\services\bookInventoryService.ts
import { db } from "@/db";
import { books } from "@/db/schema/books";
import { ilike, and } from "drizzle-orm";

export const findBookInInventory = async (title: string, author?: string) => {
  const result = await db
    .select()
    .from(books)
    .where(
      and(
        ilike(books.title, `%${title}%`),
        author ? ilike(books.author, `%${author}%`) : undefined
      )
    )
    .limit(1);

  return result[0] || null;
};
