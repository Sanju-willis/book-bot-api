// src/routes/messengerRoute.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  verifyMessengerWebhook,
  handleMessengerEvent,
} from "../controllers/messengerController";

const router = Router();

router.get("/webhook", asyncHandler(verifyMessengerWebhook));
router.post("/webhook", asyncHandler(handleMessengerEvent));

export default router;
