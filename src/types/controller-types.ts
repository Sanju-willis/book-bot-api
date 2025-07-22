export type User = {
  id?: string;
  from?: string; // user ID or phone number
  name: string;
  phoneNumber: string;
  platform: "whatsapp" | "web" | "instagram" | "messenger";
  sessionId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Message = {
  id: string;
  from: string; 
  to: string; 
  text?: string;
  imageUrl?: string;
  imageText?: string;
  type: "text" | "image" | "image_with_text";
  timestamp: number;
  inputType: "text_only" | "image_only" | "image_with_text";
  sessionId: string;
  intent?: string;
  contentType?: "book" | "receipt" | "text_only" | "other";
};
export type ParsedMessage = {
  user: User;
  message: Message;
};
