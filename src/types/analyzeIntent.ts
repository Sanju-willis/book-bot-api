export type AnalyzeInput = {
  msgType: string;
  userText: string;
  extractedText?: string;
};

export type Intent =
  | "general_help"
  | "book_inquiry"
  | "order_status"
  | "complaint"
  | "unknown";

export type ContentType =
  | "book"
  | "receipt"
  | "text_only"
  | "unknown"

export type AnalyzeResult = {
  intent: Intent;
  confidence: number;
  content_type: ContentType;
  data: Record<string, any>;
};

export type SessionData = {
  intent: Intent;
  contentType: ContentType;
  data: any;
  lastUpdated: number;
};