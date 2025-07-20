// src\utils\responses\bookResponse.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
});

const prompt = PromptTemplate.fromTemplate(`
You're a helpful bookstore assistant. Based on the book data, write a short response to the user, confirming you'll check availability.

Book info:
Title: {title}
Author: {author}
Publisher: {publisher}
ISBN: {isbn}

Response:
`);

export const generateBookResponse = async (data: any): Promise<string> => {
  const { title = "", author = "", publisher = "", isbn = "" } = data || {};
console.log('...');
  if (!title && !author) {
    return "❓ I couldn't extract the book title. Could you type it manually?";
  }

  const chain = prompt.pipe(model);
  const result = await chain.invoke({ title, author, publisher, isbn });

  if (typeof result.content === "string") {
    return result.content.trim();
  }

  return "🤖 Got your request. Checking availability...";
};
