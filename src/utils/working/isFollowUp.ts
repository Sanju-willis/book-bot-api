// src\utils\working\isFollowUp.ts
// src/utils/working/isFollowUp.ts
import { getSessionData } from "./sessionMemory";

export const isFollowUpMessage = (sessionId: string, msgText: string | undefined): boolean => {
  const session = getSessionData(sessionId);
  if (!session || !msgText) return false;

  // Customize this condition based on your domain
  const text = msgText.toLowerCase();
  const keywords = ["also", "another", "btw", "forgot", "my last order", "didn't arrive"];
  return keywords.some(kw => text.includes(kw));
};
