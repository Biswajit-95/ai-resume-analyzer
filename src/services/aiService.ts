// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {
//   resumeAnalysisResponseSchema,
//   ResumeAnalysisResponse,
// } from "../schemas/resumeAnalysisSchema";
// import { extractJsonFromText } from "../utils/extractJson";

// import { ChatGroq } from "@langchain/groq"; // ✅ changed

// const model = new ChatGroq({
//   model: "llama-3.3-70b-versatile",
//   apiKey: process.env.GROQ_API_KEY!,
//   temperature: 0,
// });

// /**
//  * Initialize LLM
//  */
// // const model = new ChatGoogleGenerativeAI({
// //   model: "gemini-2.0-flash-lite",
// //   apiKey: process.env.GEMINI_API_KEY!,
// //   temperature: 0,
// // });

// /**
//  * Build prompt
//  */
// const buildPrompt = (resumeText: string) => {
//   return `
// You are an ATS resume analysis assistant.

// Analyze the resume and return ONLY valid JSON.

// {
//   "atsScore": number (0-100),
//   "hirabilityIndex": number (0-100),
//   "interviewChance": number (0-100),
//   "strengths": string[],
//   "weaknesses": string[],
//   "missingKeywords": string[],
//   "improvementSuggestions": string[]
// }

// Resume:
// ${resumeText}

// Return ONLY JSON.
// `;
// };

// /**
//  * Resume analysis
//  */
// export const analyzeResumeText = async (
//   resumeText: string
// ): Promise<ResumeAnalysisResponse> => {

//   const prompt = buildPrompt(resumeText.slice(0, 15000));

//   const response = await model.invoke(prompt);

//   const rawText =
//     typeof response.content === "string"
//       ? response.content
//       : JSON.stringify(response.content);

//   const jsonString = extractJsonFromText(rawText);

//   const parsed = JSON.parse(jsonString);

//   const validated = resumeAnalysisResponseSchema.parse(parsed);

//   return validated;
// };

import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { config } from "../config";
import { AppError, ErrorCode } from "../errors/AppError";

export const CURRENT_MODEL_VERSION = config.groq.modelVersion;

// Schema
const ResumeAnalysisSchema = z.object({
  atsScore:               z.number().int().min(0).max(100),
  hirabilityIndex:        z.number().int().min(0).max(100),
  interviewChance:        z.number().int().min(0).max(100),
  strengths:              z.array(z.string()).min(1),
  weaknesses:             z.array(z.string()).min(1),
  missingKeywords:        z.array(z.string()),
  improvementSuggestions: z.array(z.string()).min(1),
});

export type ResumeAnalysisResponse = z.infer<typeof ResumeAnalysisSchema>;

// Model
const model = new ChatGroq({
  model:       config.groq.model,
  apiKey:      config.groq.apiKey,
  temperature: 0,
});

// Prompts
const SYSTEM_PROMPT = `
You are an expert ATS resume analyst.
Evaluate the resume honestly and specifically.
Return ONLY a valid JSON object — no markdown, no explanation, no backticks.
`.trim();

const buildUserPrompt = (resumeText: string) => `
Analyze this resume and return a JSON object with exactly these fields:
{
  "atsScore": number 0-100,
  "hirabilityIndex": number 0-100,
  "interviewChance": number 0-100,
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "improvementSuggestions": string[]
}

<resume>
${resumeText}
</resume>
`.trim();

// Score caps — business rule
// Creates urgency so users consider paid rewrite
const applyScoreCaps = (result: ResumeAnalysisResponse): ResumeAnalysisResponse => ({
  ...result,
  atsScore:        Math.min(result.atsScore,        config.scoreCaps.atsScore),
  hirabilityIndex: Math.min(result.hirabilityIndex, config.scoreCaps.hirabilityIndex),
  interviewChance: Math.min(result.interviewChance, config.scoreCaps.interviewChance),
});

// Core invocation
const invokeModel = async (resumeText: string): Promise<ResumeAnalysisResponse> => {
  const response = await model.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user",   content: buildUserPrompt(resumeText) },
  ]);

  const rawText = typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);

  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  return ResumeAnalysisSchema.parse(parsed);
};

// Public — retry + caps
export const analyzeResumeText = async (
  resumeText: string
): Promise<ResumeAnalysisResponse> => {
  const truncated = resumeText.slice(0, config.groq.maxChars);
  let   lastError: unknown;

  for (let attempt = 1; attempt <= config.groq.maxRetries; attempt++) {
    try {
      const result = await invokeModel(truncated);
      return applyScoreCaps(result);  // ← caps applied after successful parse
    } catch (error) {
      lastError = error;
      console.warn(`AI attempt ${attempt}/${config.groq.maxRetries} failed:`, error);
    }
  }

  throw new AppError(
    ErrorCode.AI_ANALYSIS_FAILED,
    "AI analysis failed after retries",
    500,
    lastError
  );
};