import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query as any;
      req.params = parsed.params as any;

      return next();
    } catch (error) {
      return res.status(400).json({
        error: "Invalid request",
        details: (error as any).errors ?? error,
      });
    }
  };
