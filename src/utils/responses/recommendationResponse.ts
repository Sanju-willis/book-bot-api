import { chatModel } from "../../config/model";
import { bookRecommendationPrompt } from "./prompts/recommedPrompts";
import { createChatMemory, persistChatMemory } from "./helpers/messageMemory";
import { RunnableSequence } from "@langchain/core/runnables";

export const generateRecommendationResponse = async (
  sessionId: string,
  userText: string
): Promise<string> => {
  const memory = await createChatMemory(sessionId);
  const promptChain = RunnableSequence.from([bookRecommendationPrompt, chatModel]);

  try {
    const result = await promptChain.invoke({
      input: userText,
      chat_history: await memory.chatHistory.getMessages(),
    });

    await memory.saveContext(
      { input: userText },
      { response: result.content || "" }
    );

    await persistChatMemory(sessionId, memory);

    const reply = String(result.content).trim();
    return reply || "📚 Here's a book I recommend!";
  } catch (err) {
    console.error("❌ Error generating recommendation:", err);
    return "⚠️ Something went wrong while recommending a book.";
  }
};
