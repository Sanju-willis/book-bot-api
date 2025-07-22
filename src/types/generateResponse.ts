export type Intent =
  | "general_help"
  | "book_inquiry"
  | "recommend_book"
  | "order_status"
  | "complaint"
  | "unknown";

export type ContentType =
  | "book"
  | "receipt"
  | "text_only"
  | "unknown"

export interface AnalysisResult {
  intent: Intent;
  sessionId: string;
  confidence: number;
  userText: string;
  imageText: string;
  contentType?: ContentType;
  data?: any;
  from: string;
}