// src/errors/Errors.ts

// 🌐 Base Application Error
export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode = 500,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

// 🔧 System & Environment Errors
export class EnvError extends BaseError {
  constructor(description = "Invalid or missing environment variable") {
    super("EnvError", 500, description, false);
  }
}

// 🔍 Intent & AI Processing
export class AnalyzeIntentError extends BaseError {
  constructor(description = "Message analysis failed", cause?: unknown) {
    super("AnalyzeIntentError", 500, description);
    if (cause) console.error("🔍 Cause:", cause);
  }
}


// 🔐 Auth & Validation
export class ValidationError extends BaseError {
  constructor(description = "Validation failed") {
    super("ValidationError", 400, description);
  }
}
export class AuthenticationError extends BaseError {
  constructor(description = "Authentication failed") {
    super("AuthenticationError", 401, description);
  }
}
export class AuthorizationError extends BaseError {
  constructor(description = "Not authorized") {
    super("AuthorizationError", 403, description);
  }
}

// ⚠️ Generic App Errors
export class NotFoundError extends BaseError {
  constructor(description = "Resource not found") {
    super("NotFoundError", 404, description);
  }
}
export class ConflictError extends BaseError {
  constructor(description = "Conflict error") {
    super("ConflictError", 409, description);
  }
}
export class ExternalServiceError extends BaseError {
  constructor(description = "External service failure") {
    super("ExternalServiceError", 502, description);
  }
}

// 📷 OCR & Media Processing
export class MediaURLFetchError extends BaseError {
  constructor(description = "Failed to fetch media URL") {
    super("MediaURLFetchError", 502, description);
  }
}
export class MediaDownloadError extends BaseError {
  constructor(description = "Failed to download media content") {
    super("MediaDownloadError", 502, description);
  }
}
export class OCRServiceError extends BaseError {
  constructor(description = "OCR service failed") {
    super("OCRServiceError", 502, description);
  }
}

// 📚 Book Assistant Errors
export class BookSearchError extends BaseError {
  constructor(description = "Book search failed") {
    super("BookSearchError", 500, description);
  }
}
export class BookAssistantError extends BaseError {
  constructor(description = "Book assistant failed") {
    super("BookAssistantError", 500, description);
  }
}
export class BookExtractionError extends BaseError {
  constructor(description = "Failed to extract book info") {
    super("BookExtractionError", 400, description);
  }
}
export class BookNotFoundError extends BaseError {
  constructor(description = "Book not found") {
    super("BookNotFoundError", 404, description);
  }
}
