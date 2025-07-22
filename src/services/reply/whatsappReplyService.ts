// src\utils\helpersReply\sendWhatsAppReply.ts
import axios from "axios";
import { PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } from "../../config/env";

export const sendWhatsAppReply = async (to: string, message: string) => {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    //console.log("✅ Auto-reply sent:", res.data);
  } catch (error: any) {
    console.error(
      "❌ Failed to send reply:",
      error?.response?.data || error.message
    );
  }
};
