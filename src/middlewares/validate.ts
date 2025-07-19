// src\middlewares\validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // throw ZodError to trigger global error handler
      throw result.error;
    }

    // overwrite validated input (optional, for stricter typing)
    req[source] = result.data;
    next();
  };
};
