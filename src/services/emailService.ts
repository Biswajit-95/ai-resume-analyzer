import axios from "axios";
import { env } from "../config";
import { ResumeAnalysisResponse } from "../schemas/resumeAnalysisSchema";

export const sendAnalysisEmail = async (
  to: string,
  leadName: string,
  analysis: ResumeAnalysisResponse,
  resumeUrl?: string,
) => {
  const subject = "Your Resume Analysis Report";
  const body = `Hi ${leadName},

Here is your resume analysis from our AI Resume Analyzer service.

ATS Score: ${analysis.atsScore}
Hirability Index: ${analysis.hirabilityIndex}
Interview Chance: ${analysis.interviewChance}%

Strengths:
- ${analysis.strengths.join("\n- ")}

Weaknesses:
- ${analysis.weaknesses.join("\n- ")}

Missing Keywords:
- ${analysis.missingKeywords.join("\n- ")}

Improvement Suggestions:
- ${analysis.improvementSuggestions.join("\n- ")}

${resumeUrl ? `Resume: ${resumeUrl}\n\n` : ""}
Thanks for using the service!`;

  await axios.post(
    "https://api.resend.com/emails",
    {
      from: "noreply@yourdomain.com",
      to,
      subject,
      text: body,
    },
    {
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30_000,
    },
  );
};
