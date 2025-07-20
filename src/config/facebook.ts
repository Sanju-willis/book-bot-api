// src\config\facebook.ts
import dotenv from "dotenv";
dotenv.config();

export const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
export const FB_GRAPH_API = "https://graph.facebook.com/v23.0";
