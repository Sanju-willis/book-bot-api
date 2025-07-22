// src/controllers/messengerController.ts
import { Request, Response } from "express";
import { sendMessengerReply } from "../services/reply/messengerReplyService";
import { parseMessengerWebhook } from "../utils/parsers/messengerParser";
import { extractMessengerAnalytics } from "../utils/analytics/extractMessengerAnalytics";


const VERIFY_TOKEN = "myVerifyToken123";

export const verifyMessengerWebhook = async (req: Request, res: Response): Promise<void> => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Messenger Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};


export const handleMessengerEvent = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const headers = req.headers;

  const analytics = extractMessengerAnalytics(headers);
  console.log("📊 Messenger Analytics:", analytics);

  const messages = parseMessengerWebhook(body);

  for (const { user, message } of messages) {
    console.log(`💬 ${user.senderId}: ${message.text}`);
    if (message.text) {
      await sendMessengerReply(user.senderId, "Hi! You are stupid.");
    }
  }

  res.sendStatus(200);
};