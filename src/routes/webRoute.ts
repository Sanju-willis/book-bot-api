// src\routes\webRoute.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import upload from "../middlewares/multer";
import { handleChatMessages } from "../controllers/chatController";

const router = Router();

// Accept text + file in multipart/form-data
router.post("/", upload.single("file"), asyncHandler(handleChatMessages));

export default router;
