import { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";

import { uploadToR2 }            from "../services/storageService";
import { extractTextFromBuffer } from "../services/textExtractionService";
import { analyzeResumeText, CURRENT_MODEL_VERSION } from "../services/aiService";
import { normalizeText }         from "../utils/normalizeText";
import { AppError, ErrorCode }   from "../errors/AppError";

import { Lead }         from "../models/Lead";
import { Analysis }     from "../models/Analysis";
import { LeadAnalysis } from "../models/LeadAnalysis";

export const analyzeResume = async (req: Request, res: Response) => {
  // STEP 1 — Extract text
  let extractedText: string;
  try {
    extractedText = await extractTextFromBuffer(req.file!.buffer, req.file!.mimetype);
  } catch (error) {
    throw new AppError(ErrorCode.TEXT_EXTRACTION_FAILED, "Could not read resume file", 422, error);
  }

  // STEP 2 — Normalize + hash
  const normalizedText = normalizeText(extractedText);
  const resumeHash     = crypto
    .createHash("sha256")
    .update(normalizedText)
    .digest("hex");

  // Add this temporarily to debug your double-upload issue
  console.log("[DEBUG] resumeHash:", resumeHash);
  console.log("[DEBUG] modelVersion:", CURRENT_MODEL_VERSION);

  // STEP 3 — Cache lookup
  let analysis = await Analysis.findOne({ resumeHash, modelVersion: CURRENT_MODEL_VERSION });
  console.log("[DEBUG] cache hit:", !!analysis);

  if (!analysis) {
    const aiResult = await analyzeResumeText(extractedText);

    const claimed = await Analysis.findOneAndUpdate(
      { resumeHash, modelVersion: CURRENT_MODEL_VERSION },
      {
        $setOnInsert: {
          resumeHash,
          extractedText,
          modelVersion: CURRENT_MODEL_VERSION,
          resumeUrl: null,
          ...aiResult,
        },
      },
      { upsert: true, new: true }
    );

    // Only winner uploads
    if (!claimed.resumeUrl) {
      const resumeUrl = await uploadToR2(
        req.file!.buffer,
        req.file!.originalname,
        req.file!.mimetype
      );
      analysis = await Analysis.findOneAndUpdate(
        { _id: claimed._id },
        { $set: { resumeUrl } },
        { new: true }
      );
    } else {
      analysis = claimed;
    }
  }

  // STEP 4 — Lead + LeadAnalysis in transaction
  const session = await mongoose.startSession();
  let lead:         InstanceType<typeof Lead>;
  let leadAnalysis: InstanceType<typeof LeadAnalysis>;

  try {
    await session.withTransaction(async () => {
      const { name, email, phone } = req.body;

      [lead] = await Lead.create(
        [{ name, email, phone, resumeHash, resumeUrl: analysis!.resumeUrl,
           resumeFilename: req.file!.originalname, resumeMimeType: req.file!.mimetype }],
        { session }
      );

      [leadAnalysis] = await LeadAnalysis.create(
        [{ leadId: lead._id, analysisId: analysis!._id }],
        { session }
      );

      lead.leadAnalysisId = leadAnalysis._id;
      await lead.save({ session });
    });
  } catch (error) {
    throw new AppError(ErrorCode.DB_WRITE_FAILED, "Failed to save submission", 500, error);
  } finally {
    await session.endSession();
  }

  return res.status(201).json({
    message:  "Resume analyzed successfully",
    analysis: { ...analysis!.toObject(), leadId: lead!._id },
  });
};
