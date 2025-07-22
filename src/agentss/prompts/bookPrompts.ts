import { PromptTemplate } from "@langchain/core/prompts";

// Prompt for detecting book-related user intent
export const detectBookIntentPrompt = PromptTemplate.fromTemplate(`
Given the message, what is the user's intent?

Options:
- find_book
- get_price
- check_stock
- unknown

Message: {input}
Intent:
`);

// Prompt for fallback assistant response when intent is unclear
export const bookFallbackPrompt = PromptTemplate.fromTemplate(`
You're a helpful book assistant.

User is asking something about books. Use the chat history to reply naturally.

Chat History:
{chat_history}

Message: {input}

Assistant:
`);
