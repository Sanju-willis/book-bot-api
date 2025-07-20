// src\controllers\chatController.ts
import { Request, Response } from "express";
import { processUserMessage } from "../services/chattService";

export const handleChatMessage = async (req: Request, res: Response) => {
  const message = req.body.message;
  const sessionId = req.body.sessionId as string;
  const uploadedFile = req.file;

  //console.log("Controller Msg:", message);
  //console.log("Controller File:", uploadedFile);
  //console.log("Controller session id", sessionId);

  const reply = await processUserMessage(message, sessionId, uploadedFile);
  res.json(reply);
};
