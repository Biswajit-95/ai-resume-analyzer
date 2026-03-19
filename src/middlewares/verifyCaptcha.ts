import { Request, Response, NextFunction } from "express";
import { AppError, ErrorCode }             from "../errors/AppError";
import { env }                             from "../config";

interface TurnstileResponse {
  success:      boolean;
  "error-codes": string[];
}

export const verifyCaptcha = async (
  req:  Request,
  res:  Response,
  next: NextFunction
) => {
  // skip in development so you can test without captcha
  if (env.NODE_ENV === "development") return next();

  const token = req.body["cf-turnstile-response"];

  if (!token) {
    return next(
      new AppError(ErrorCode.CAPTCHA_FAILED, "Captcha token missing", 400)
    );
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret:   env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: req.ip,
        }),
      }
    );

    const data = await response.json() as TurnstileResponse;

    if (!data.success) {
      return next(
        new AppError(ErrorCode.CAPTCHA_FAILED, "Captcha verification failed", 400)
      );
    }

    next();
  } catch (error) {
    return next(
      new AppError(ErrorCode.CAPTCHA_FAILED, "Captcha service unreachable", 503)
    );
  }
};
