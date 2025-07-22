import { PromptTemplate } from "@langchain/core/prompts";

export const complaintFollowupPrompt = PromptTemplate.fromTemplate(`
You're a helpful support assistant for a bookstore.

Use context from the chat history to ask for more details if needed. Be empathetic.

Chat History:
{chat_history}

User Message:
{input}

Assistant:
`);
