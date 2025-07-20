// src\controllers\whatsappSendController.ts
import { Request, Response } from "express";
import { sendWhatsAppMessage } from "../services/whatsappSendService";
import { ValidationError, ExternalServiceError } from "../errors/Errors";

export const sendMessageController = async (req: Request, res: Response): Promise<void> => {
  const { to, text } = req.body;

  if (!to || !text) {
    throw new ValidationError("Missing 'to' or 'text' in request body");
  }

  try {
    const response = await sendWhatsAppMessage(to, text);
    res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    console.error("❌ Failed to send message:", err.response?.data || err.message);
    throw new ExternalServiceError("Failed to send message to WhatsApp");
  }
};
