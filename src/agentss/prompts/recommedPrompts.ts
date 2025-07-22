import { PromptTemplate } from "@langchain/core/prompts";

export const bookRecommendationPrompt = PromptTemplate.fromTemplate(`
You are a bookstore assistant. Based on the user's preferences, recommend 1–3 books.

Chat History:
{chat_history}

User Message:
{input}

Recommendation:
`);
