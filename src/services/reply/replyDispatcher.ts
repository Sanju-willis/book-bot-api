// /src/services/reply/replyDispatcher.ts
import { sendWhatsAppReply } from "./whatsappReplyService";
import { sendMessengerReply } from "./messengerReplyService";

type Platform = "whatsapp" | "messenger" | "instagram";

export const sendReply = async (
  platform: Platform,
  recipientId: string,
  message: string
) => {
  switch (platform) {
    case "whatsapp":
      return await sendWhatsAppReply(recipientId, message);
    case "messenger":
      return await sendMessengerReply(recipientId, message);
   
    default:
      throw new Error(`[Dispatcher] Unsupported platform: ${platform}`);
  }
};
