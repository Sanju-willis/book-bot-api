// src/utils/parsers/messengerParser.ts

export type ParsedMessengerPayload = {
  user: {
    senderId: string;
    recipientId: string;
    timestamp: number;
  };
  message: {
    messageId: string;
    text?: string;
  };
};

export const parseMessengerWebhook = (body: any): ParsedMessengerPayload[] => {
  if (!body || body.object !== "page") return [];

  const results: ParsedMessengerPayload[] = [];

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const senderId = event.sender?.id;
      const recipientId = event.recipient?.id;
      const timestamp = event.timestamp;
      const messageId = event.message?.mid;
      const text = event.message?.text;

      if (senderId && recipientId && messageId) {
        results.push({
          user: {
            senderId,
            recipientId,
            timestamp,
          },
          message: {
            messageId,
            text,
          },
        });
      }
    }
  }

  return results;
};
