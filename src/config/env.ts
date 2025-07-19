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
