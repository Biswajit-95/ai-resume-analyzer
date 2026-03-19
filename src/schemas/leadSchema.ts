import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
