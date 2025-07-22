// src\services\messengerService.ts
import axios from "axios";
import { FB_GRAPH_API, FB_PAGE_ACCESS_TOKEN } from "../../config/facebook";

export const sendMessengerReply = async (
  recipientId: string,
  message: string
) => {
  try {
    await axios.post(
      `${FB_GRAPH_API}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        params: { access_token: FB_PAGE_ACCESS_TOKEN },
      }
    );
  } catch (err: any) {
    console.error(
      "[Messenger] Failed to send message:",
      err.response?.data || err.message
    );
  }
};
