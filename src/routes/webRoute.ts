// src\routes\webRoute.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import upload from "../middlewares/multer";
import { handleChatMessage } from "../controllers/chatController";

const router = Router();

// Accept text + file in multipart/form-data
router.post("/", upload.single("file"), asyncHandler(handleChatMessage));

export default router;
