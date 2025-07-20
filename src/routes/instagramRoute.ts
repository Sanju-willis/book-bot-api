// src\routes\instagramRoute.ts
import { Router } from "express";
const router = Router();

const VERIFY_TOKEN = "myVerifyToken123"; // Same as WhatsApp/Messenger

// GET for webhook verification
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Instagram Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// POST for receiving IG messages
router.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("📸 Instagram Message Event:", JSON.stringify(body, null, 2));
  res.sendStatus(200);
});

export default router;
