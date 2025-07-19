// src\app.ts
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import chatRoute from "./routes/chatRoute";
import whatsappRoute from "./routes/whatsappRoute";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);
app.use("/webhook/whatsapp", whatsappRoute);

app.use(errorHandler);

export default app;
