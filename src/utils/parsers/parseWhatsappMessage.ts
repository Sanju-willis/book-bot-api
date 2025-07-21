// src\utils\parseWhatsappMessage.ts
export type InputType =
  | "text_only"
  | "image_only"
  | "image_with_text"
  | "media_other"
  | "unknown";

export interface ParsedWhatsappMessage {
  messageId: string;
  from: string;
  name: string | null;
  text: string | null;
  mediaType: string | null;
  mediaId: string | null;
  timestamp: number;
  phoneNumberId: string;
  inputType: InputType;
}

export const parseWhatsappMessage = (body: any): ParsedWhatsappMessage[] => {
  const parsedMessages: ParsedWhatsappMessage[] = [];

  const entries = body.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value || {};
      const messages = value.messages || [];
      const contacts = value.contacts || [];
      const phoneNumberId = value.metadata?.phone_number_id || "";

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const contact = contacts[i] || {};

        const messageType = msg.type;
        const mediaObject = msg[messageType] || {};

        // Base text fallback
        let text = msg.text?.body || mediaObject.caption || null;

        // Add fallbacks for non-text types
        if (!text && messageType === "location") {
          text = `📍 Location: ${mediaObject.latitude}, ${mediaObject.longitude}`;
        } else if (!text && messageType === "contact") {
          text = `👤 Contact shared: ${
            mediaObject.name?.formatted_name || "Unknown"
          }`;
        } else if (!text && messageType === "sticker") {
          text = `🖼️ Sticker received`;
        } else if (!text && messageType === "document") {
          text = `📄 Document: ${mediaObject.filename || "Unnamed"}`;
        }

        const mediaId =
          mediaObject.id ||
          (messageType === "sticker" ? mediaObject.media_key : null);

        // Determine inputType
        let inputType: InputType = "unknown";
        if (messageType === "text") {
          inputType = "text_only";
        } else if (messageType === "image") {
          inputType = text ? "image_with_text" : "image_only";
        } else if (
          [
            "audio",
            "video",
            "document",
            "sticker",
            "location",
            "contact",
          ].includes(messageType)
        ) {
          inputType = "media_other";
        }

        parsedMessages.push({
          from: msg.from,
          phoneNumberId,
          name: contact.profile?.name || null,
          messageId: msg.id,
          inputType,
          text,
          mediaType: messageType !== "text" ? messageType : null,
          mediaId,
          timestamp: parseInt(msg.timestamp),
        });
      }
    }
  }

  return parsedMessages;
};
