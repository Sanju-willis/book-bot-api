export interface IncomingMessage {
  platform: string;
  user: {
    from: string;
    name: string;
  };
  message: {
    msgType: string;
    text: string;            // Caption or user message
    extractedText?: string;  // OCR or transcript (optional)
    mediaId?: string;
    timestamp: number;
    messageId: string;
  };
}
