export type AnalyzeResult =
  | BookIntentResult
  | ReceiptIntentResult
  | UnknownIntentResult;

interface BaseResult {
  intent:
    | "book_inquiry"
    | "order_status"
    | "complaint"
    | "greeting"
    | "smalltalk"
    | "goodbye"
    | "unknown";
  confidence: number;
  content_type: "book" | "receipt" | "text_only" | "unknown";
}

export interface BookIntentResult extends BaseResult {
  content_type: "book";
  data: {
    title: string;
    author: string;
    publisher?: string;
    isbn?: string;
  };
}

export interface ReceiptIntentResult extends BaseResult {
  content_type: "receipt";
  data: {
    order_id: string;
    date: string; // format YYYY-MM-DD
    total: string; // e.g. "Rs. 1500"
    items?: string[];
  };
}

export interface UnknownIntentResult extends BaseResult {
  content_type: "text_only" | "unknown";
  data: {};
}
