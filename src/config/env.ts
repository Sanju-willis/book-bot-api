// src\config\env.ts
import { EnvError } from "../errors/Errors";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new EnvError(key);
  return value;
};

export const OPENAI_API_KEY = getEnv("OPENAI_API_KEY");
export const PORT = parseInt(getEnv("PORT"), 10);

if (isNaN(PORT)) throw new EnvError("PORT must be a number");

// ✅ WhatsApp API-specific exports
export const PHONE_NUMBER_ID = getEnv("WHATSAPP_PHONE_NUMBER_ID");
export const WHATSAPP_ACCESS_TOKEN = getEnv("WHATSAPP_ACCESS_TOKEN");
export const WHATSAPP_VERIFY_TOKEN = getEnv("WHATSAPP_VERIFY_TOKEN");

// ✅ Google Vision API
export const GOOGLE_CLIENT_EMAIL = getEnv("GOOGLE_CLIENT_EMAIL");
export const GOOGLE_PRIVATE_KEY = getEnv("GOOGLE_PRIVATE_KEY");