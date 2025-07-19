// src\errors\Errors.ts

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode = 500, description = "Internal Server Error", isOperational = true) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
export class EnvError extends BaseError {
  constructor(description = "Invalid or missing environment variable") {
    super("EnvError", 500, description, false); // not operational = false (critical misconfig)
  }
}

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
export class OCRServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OCRServiceError";
  }
}
export class BookSearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookSearchError";
  }
}
export class BookAssistantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookAssistantError";
  }
}

export class BookExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookExtractionError";
  }
}

export class BookNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookNotFoundError";
  }
}
