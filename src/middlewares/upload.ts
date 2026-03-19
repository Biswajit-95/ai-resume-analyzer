import multer from "multer";
import { Request } from "express";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Only PDF or DOCX files are allowed"));
  },
});

export type UploadedResume = Express.Multer.File;

export const getUploadedResume = (req: Request): UploadedResume => {
  if (!req.file) {
    throw new Error("No resume file uploaded");
  }
  return req.file;
};

