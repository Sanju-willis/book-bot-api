// src\utils\working\sessionManager.ts
const sessionMap = new Map<
  string,
  { sessionId: string; lastSeen: number }
>();

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const getOrCreateSessionId = async (
  userId: string,
  timestamp: number // WhatsApp timestamp in seconds
): Promise<string> => {
  const now = timestamp * 1000; // convert to ms
  const existing = sessionMap.get(userId);

  if (existing && now - existing.lastSeen < SESSION_TIMEOUT) {
    // Reuse session
    sessionMap.set(userId, {
      ...existing,
      lastSeen: now,
    });
    return existing.sessionId;
  }

  // Create new session
  const newSessionId = `session_${userId}_${Date.now()}`;
  sessionMap.set(userId, {
    sessionId: newSessionId,
    lastSeen: now,
  });

  return newSessionId;
};
