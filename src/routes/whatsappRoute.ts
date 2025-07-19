import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

router.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    (body.entry as any[]).forEach(async (entry: any) => {
      (entry.changes as any[]).forEach(async (change: any) => {
        const messages = change.value?.messages;
        if (messages) {
          for (const message of messages) {
            const from = message.from; // sender's phone number
            const text = message.text?.body;

            console.log("📩 WhatsApp message received:", { from, text });

            try {
              await axios.post(
                `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
                {
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: "Thanks for your message! We'll get back to you shortly.",
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log("✅ Auto-reply sent");
            } catch (error: any) {
              console.error("❌ Failed to send reply:", error?.response?.data || error.message);
            }
          }
        }
      });
    });

    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

export default router;
