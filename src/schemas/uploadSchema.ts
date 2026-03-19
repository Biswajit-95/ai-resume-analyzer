import { z } from "zod";

export const uploadResumeSchema = z.object({
  body: z.object({
    leadId: z.string().min(1),
  }),
});
