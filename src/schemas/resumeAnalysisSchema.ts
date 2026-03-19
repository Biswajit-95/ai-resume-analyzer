import { z } from "zod";

export const resumeAnalysisResponseSchema = z.object({
  atsScore: z.number().min(0).max(100),
  hirabilityIndex: z.number().min(0).max(100),
  interviewChance: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
});

export type ResumeAnalysisResponse = z.infer<
  typeof resumeAnalysisResponseSchema
>;
