// src/routes/instagramRoute.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  verifyInstagramWebhook,
  handleInstagramEvent,
} from "../controllers/instagramController";

const router = Router();

router.get("/webhook", asyncHandler(verifyInstagramWebhook));
router.post("/webhook", asyncHandler(handleInstagramEvent));

export default router;
