import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  logger.error({ err, path: req.path }, "Unhandled error");

  const status = (err as any)?.statusCode ?? 500;
  const message = (err as any)?.message ?? "Internal server error";

  res.status(status).json({
    error: message,
  });
};
