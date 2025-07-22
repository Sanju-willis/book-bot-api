// src\services\whatsappSendService.ts
import axios from "axios";
import { PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } from "../../config/env";

export const sendWhatsAppMessage = async (to: string, text: string) => {
  const res = await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
