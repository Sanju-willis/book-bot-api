// src\types\whatsapp.ts
import type { InputType } from "../utils/parsers/parseWhatsappMessage";

export interface IncomingWhatsappMessage {
  from: string;
  msgText: string | null;
  imageText?: string | null;
  mediaType: string | null;
  mediaId: string | null;
  name: string | null;
  timestamp: number;
  inputType: InputType;
}
