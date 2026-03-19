import { ResumeAnalysisResponse } from "../schemas/resumeAnalysisSchema";

export const applyBusinessScoreCaps = (
  analysis: ResumeAnalysisResponse,
): ResumeAnalysisResponse => {
  return {
    ...analysis,
    atsScore: Math.min(analysis.atsScore, 58),
    hirabilityIndex: Math.min(analysis.hirabilityIndex, 55),
    interviewChance: Math.min(analysis.interviewChance, 48),
  };
};
