// src\routes\whatsappRoute.ts
import { Router } from "express";

const router = Router();

const VERIFY_TOKEN = "myVerifyToken123"; // use the same as in Meta UI

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

router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    (body.entry as any[]).forEach((entry: any) => {
      (entry.changes as any[]).forEach((change: any) => {
        const messages = change.value?.messages;
        if (messages) {
          (messages as any[]).forEach((message: any) => {
            console.log("📩 WhatsApp message received:", message);
            // Optional: Add your logic here
          });
        }
      });
    });
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});


export default router;
