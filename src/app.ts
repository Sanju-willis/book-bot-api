// src\app.ts
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import webRoute from "./routes/webRoute";
import whatsappRoute from "./routes/whatsappRoute";
import messengerRoute from "./routes/messengerRoute";
import instagramRoute from "./routes/instagramRoute";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", webRoute);
app.use("/webhook/whatsapp", whatsappRoute);
app.use("/webhook/messenger", messengerRoute);
app.use("/webhook/instagram", instagramRoute);

app.use(errorHandler);

export default app;
