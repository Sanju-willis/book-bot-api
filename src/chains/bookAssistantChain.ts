// src\chains\bookAssistantChain.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
});

const prompt = PromptTemplate.fromTemplate(`
You are a helpful book assistant.

Given the user's message and (optional) image-extracted text, decide what to do.

Return:
- action: "lookup" | "ask_followup"
- title: extracted book title (if any)
- author: extracted author (if any)
- reason: short explanation if follow-up is needed

Respond ONLY as JSON.

Input:
""" {input} """

Output:
{{  
  "action": "...",  
  "title": "...",  
  "author": "...",  
  "reason": "..."  
}}
`);


const parser = new JsonOutputParser<{
  action: "lookup" | "ask_followup";
  title: string;
  author: string;
  reason: string;
}>();

export const bookAssistantChain = RunnableSequence.from([
  async (input: string) => {
    console.log("🧾 Raw Input:", input);
    return { input };
  },
  async (inputObj) => {
    const formattedPrompt = await prompt.format(inputObj);
    console.log("📨 Final Prompt:", formattedPrompt); // 👈 SEE THIS
    return formattedPrompt;
  },
  model,
  async (output) => {
    console.log("📤 Raw LLM Output:", output);
    return output;
  },
  parser,
]);
