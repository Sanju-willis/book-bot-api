import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { findBookTool } from "../tools/findBookTool";
import { orderStatusTool } from "@/tools/orderStatusTool";
import { generalHelpTool } from "@/tools/generalHelpTool";
// Add more tools as needed

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

export const getExecutor = async () => {
  return await initializeAgentExecutorWithOptions(
    [
      findBookTool,
      orderStatusTool,
      generalHelpTool,
      // complaintTool (optional)
    ],
    model,
    {
      agentType: "openai-functions", // needed for tool calling
      verbose: true,
    }
  );
};
