
// routes/resume.ts
import { Router } from "express";
import { analyzeResume }        from "../controllers/analyzeController";
import { uploadResume } from "../middlewares/upload";
import { validateResumeUpload } from "../middlewares/validateResumeUpload";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyCaptcha } from "../middlewares/verifyCaptcha";

const router = Router();

router.post(
  "/",
  uploadResume.single("resume"),  // 1. parse multipart — must be first
  asyncHandler(verifyCaptcha),    // 2. verify captcha token
  validateResumeUpload,           // 3. validate fields
  asyncHandler(analyzeResume),    // 4. process
);

// router.post(
//   "/",
//   uploadResume.single("resume"),   // ← only one multer, the configured one
//   validateResumeUpload,            // ← validation runs after multer
//   analyzeResume,
// );

export default router;