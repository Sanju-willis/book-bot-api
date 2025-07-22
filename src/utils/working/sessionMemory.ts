// src\utils\working\sessionMemory.ts
import type { SessionData,Intent, ContentType } from "../../types/analyzeIntent";

const sessionStore = new Map<string, SessionData>();

export const saveSessionData = (
  sessionId: string,
  payload: {
    intent: Intent;
    contentType: ContentType;
    data: any;
  }
) => {
  const sessionData = {
    ...payload,
    lastUpdated: Date.now(),
  };

  console.log("💾 Saving to sessionStore:", { sessionId, sessionData }); // ✅ log here

  sessionStore.set(sessionId, sessionData);
};

export const getSessionData = (sessionId: string): SessionData | undefined => {
  return sessionStore.get(sessionId);
};

export const clearSessionData = (sessionId: string): void => {
  sessionStore.delete(sessionId);
};
