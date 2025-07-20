// src\routes\messengerRoute.ts
import { Router } from "express";
import { sendMessengerReply } from "../services/messengerService";

const router = Router();
const VERIFY_TOKEN = "myVerifyToken123"; // same as WhatsApp token

// Verification
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Messenger Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});
router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        const senderId = event.sender.id;
        const userMsg = event.message?.text;

        if (userMsg) {
          console.log(`💬 ${senderId}: ${userMsg}`);
          sendMessengerReply(senderId, "Hi! I received your message.");
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Message receiver
router.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("📨 Messenger Webhook Event:", JSON.stringify(body, null, 2));
  res.sendStatus(200);
});

export default router;
