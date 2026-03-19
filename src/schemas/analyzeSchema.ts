import { z } from "zod";

export const analyzeResumeSchema = z.object({
  body: z.object({
    leadId: z.string().min(1),
  }),
});
