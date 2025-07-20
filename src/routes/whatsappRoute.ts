// src\routes\whatsappRoute.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";

import { verifyWebhook, receiveMessage } from "../controllers/whatsappController";
import { sendMessageController } from "../controllers/whatsappSendController";

const router = Router();

router.get("/webhook", asyncHandler(verifyWebhook));
router.post("/webhook", asyncHandler(receiveMessage));
router.post("/send", asyncHandler(sendMessageController));

export default router;
