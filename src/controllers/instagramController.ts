import { Request, Response } from "express";
import { VERIFY_TOKEN } from "../config/env";
import { sendInstagramReply } from "../services/reply/instagramReplyService";

export const verifyInstagramWebhook = async (req: Request, res: Response): Promise<void> => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Instagram Webhook verified");
    res.status(200).send(challenge); // ✅ don't return
  } else {
    res.sendStatus(403); // ✅ don't return
  }
};


export const handleInstagramEvent = async (req: Request, res: Response) => {
  console.log("📩 IG Webhook Headers:", req.headers);
  console.log("📸 IG Webhook Body:", JSON.stringify(req.body, null, 2));

  const body = req.body;

  if (body.object === "instagram") {
    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        const senderId = event.sender?.id;
        const text = event.message?.text;

        if (senderId && text) {
          console.log(`💬 IG Message from ${senderId}: ${text}`);
          try {
            await sendInstagramReply(senderId, "📣 Thanks for your message!");
          } catch (err) {
            console.error("❌ Error sending IG reply:", err);
          }
        } else {
          console.log("ℹ️ No sender or text found in event.");
        }
      }
    }
  }

  res.sendStatus(200);
};

