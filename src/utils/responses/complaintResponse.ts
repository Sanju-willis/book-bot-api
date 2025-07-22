import { chatModel } from "../../config/model";
import { complaintFollowupPrompt } from "./prompts/generalPrompts";
import { createChatMemory, persistChatMemory } from "./helpers/messageMemory";
import { RunnableSequence } from "@langchain/core/runnables";

export const generateComplaintResponse = async (
  sessionId: string,
  userText: string
): Promise<string> => {
  const memory = await createChatMemory(sessionId);
  const promptChain = RunnableSequence.from([complaintFollowupPrompt, chatModel]);

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
    return reply; // ✅ This was missing
  } catch (err) {
    console.error("❌ Error generating complaint response:", err);
    return "⚠️ Something went wrong while processing your complaint.";
  }
};

