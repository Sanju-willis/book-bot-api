import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
});
