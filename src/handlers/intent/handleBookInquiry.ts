// src\handlers\intent\handleBookInquiry.ts
import { bookAssistantChain } from "../../chains/bookAssistantChain";
import { findBookInInventory } from "../../services/bookInventoryService";

export const handleBookInquiry = async (
  imageText: string,
  message: string,
) => {
  const hasImageText = imageText && imageText.trim().length > 0;
  const hasMessage = message && message.trim().length > 0;

  const combinedText = [imageText, message].filter(Boolean).join("\n");

  console.log("🧪 handleBookInquiry → combinedText:", combinedText);

  // Use LangChain to decide what to do
  const { title, author, action, reason } = await bookAssistantChain.invoke(combinedText);


  console.log("🧠 bookAssistantChain result:", { title, author, action, reason });

  // CASE 1, 2 — Vague text or image → ask follow-up
  if (action === "ask_followup") {
    console.log("🟡 Asking follow-up:", reason);
    return {
      response: `🤔 ${reason} Could you tell me the book title or author?`,
      result: null,
    };
  }

  // CASE 3, 4 — Found something meaningful → lookup
  if (!title) {
    console.log("🔴 Title missing after LangChain result");
    return {
      response: `❌ I couldn't identify the book. Could you type the title?`,
      result: null,
    };
  }

  console.log(`🔍 Searching inventory for "${title}" by "${author}"...`);
  const book = await findBookInInventory(title, author);

  if (!book) {
    console.log("❌ Book not found in DB");
    return {
      response: `❌ Sorry, *${title}* by ${author} is not in our inventory.`,
      result: { title, author, available: false },
    };
  }

  console.log("✅ Book found:", book);
  return {
    response: `📗 Yes, *${book.title}* by ${book.author} is available — Rs. ${book.price}`,
    result: { ...book, available: true },
  };
};
