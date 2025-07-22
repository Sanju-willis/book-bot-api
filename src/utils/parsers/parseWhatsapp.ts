// src/utils/parsers/parseWhatsappMessage.ts
import { User, Message } from "../../types/controller-types";

export const parseWhatsappMessages = (body: any) => {
  const messages = body.entry?.[0]?.changes?.[0]?.value?.messages || [];
  const contacts = body.entry?.[0]?.changes?.[0]?.value?.contacts || [];

  return messages.map((msg: any) => {
    const contact = contacts[0] || {};
    const from = msg.from;
    const name = contact.profile?.name || "";
    const timestamp = msg.timestamp;
    const messageId = msg.id;
    const msgType = msg.type;

    if (msgType === "text") {
      const text = msg.text?.body || "";
      return {
        user: { from, name },
        message: { msgType, text, timestamp, messageId },
      };
    }

    if (msgType === "image") {
      const mediaId = msg.image?.id;
      const caption = msg.image?.caption || "";
      const base = { msgType, image: mediaId, timestamp, messageId };
      return {
        user: { from, name },
        message: caption ? { ...base, caption } : base,
      };
    }

    if (msgType === "video") {
      const mediaId = msg.video?.id;
      const caption = msg.video?.caption || "";
      const base = { msgType, video: mediaId, timestamp, messageId };
      return {
        user: { from, name },
        message: caption ? { ...base, caption } : base,
      };
    }

    if (msgType === "audio") {
      const mediaId = msg.audio?.id;
      return {
        user: { from, name },
        message: { msgType, audio: mediaId, timestamp, messageId },
      };
    }

    if (msgType === "document") {
      const mediaId = msg.document?.id;
      const caption = msg.document?.caption || "";
      const base = { msgType, document: mediaId, timestamp, messageId };
      return {
        user: { from, name },
        message: caption ? { ...base, caption } : base,
      };
    }

    if (msgType === "interactive") {
      const interactiveType = msg.interactive?.type;
      let payload = "";

      if (interactiveType === "button_reply") {
        payload = msg.interactive?.button_reply?.id || "";
      } else if (interactiveType === "list_reply") {
        payload = msg.interactive?.list_reply?.id || "";
      }

      return {
        user: { from, name },
        message: {
          msgType,
          interactiveType,
          payload,
          timestamp,
          messageId,
        },
      };
    }

    // fallback for unknown/unsupported types
    return {
      user: { from, name },
      message: {
        msgType,
        timestamp,
        messageId,
      },
    };
  });
};
