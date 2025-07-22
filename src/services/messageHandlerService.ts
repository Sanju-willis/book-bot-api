import { getExecutor } from "../agents/assistantAgent";
import { AnalyzeInput } from "../types/analyzeIntent";

export const handleUserMessage = async ({
  msgType,
  userText,
  extractedText = "",
}: AnalyzeInput): Promise<string> => {
  const executor = await getExecutor();

  const input = `
User message type: ${msgType}
Message content: ${userText}
Extracted content: ${extractedText}
`;

  const result = await executor.invoke({ input });
  return result.output;
};
