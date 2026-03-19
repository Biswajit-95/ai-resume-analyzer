// middlewares/validateResumeUpload.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError, ErrorCode } from '../errors/AppError';
import { config } from '../config';

const bodySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/),
});

export const validateResumeUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError(ErrorCode.VALIDATION_ERROR, 'Resume file is required', 400));
  }

  if (req.file.size > config.resume.maxFileSizeBytes) {
    return next(new AppError(ErrorCode.FILE_TOO_LARGE, 'Resume must be under 5MB', 400));
  }

  //   if (!config.resume.allowedMimeTypes.includes(req.file.mimetype)) {
  //     return next(new AppError(
  //       ErrorCode.UNSUPPORTED_FILE_TYPE,
  //       `Unsupported file type: ${req.file.mimetype}`,
  //       400
  //     ));
  //   }

  const isAllowed = config.resume.allowedMimeTypes.includes(
    req.file.mimetype as (typeof config.resume.allowedMimeTypes)[number]
  );

  if (!isAllowed) {
    return next(
      new AppError(
        ErrorCode.UNSUPPORTED_FILE_TYPE,
        `Unsupported file type: ${req.file.mimetype}`,
        400
      )
    );
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(ErrorCode.VALIDATION_ERROR, parsed.error.errors[0].message, 400));
  }

  req.body = parsed.data;
  next();
};
