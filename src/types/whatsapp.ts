// src\types\whatsapp.ts
import type { InputType } from "../utils/parseWhatsappMessage";

export interface IncomingWhatsappMessage {
  from: string;
  text: string | null;
  imageText?: string | null;
  mediaType: string | null;
  mediaId: string | null;
  name: string | null;
  timestamp: number;
  inputType: InputType;
}
