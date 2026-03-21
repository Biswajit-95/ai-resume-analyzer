import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT:     z.coerce.number().default(4000),
  BASE_URL: z.string().url().default("http://localhost:4000"),

  MONGODB_URI: z.string().min(1),

  // GEMINI_API_KEY: z.string().min(1),
  // GEMINI_API_URL: z.string().url(),
  GROQ_API_KEY: z.string().min(1),

  R2_ACCOUNT_ID:        z.string().min(1),
  R2_API_TOKEN:         z.string().min(1),
  R2_BUCKET_NAME:       z.string().min(1),
  R2_ACCESS_KEY_ID:     z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),

  // RESEND_API_KEY: z.string().min(1),

  REQUESTS_PER_MINUTE: z.coerce.number().default(60),

  // SENTRY_DSN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1),

  // API_KEY: z.string().min(32),
});

// ─────────────────────────────────────────
// Validate on startup — fail fast, fail clearly
// ─────────────────────────────────────────
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:\n");
  parsed.error.errors.forEach((e) => {
    console.error(`   ${e.path.join(".")}: ${e.message}`);
  });
  console.error("\nServer cannot start. Fix the above variables.\n");
  process.exit(1);
}

export const env = parsed.data;

// ─────────────────────────────────────────
// App config — uses validated env, not raw process.env
// ─────────────────────────────────────────
export const config = {
  groq: {
    apiKey:       env.GROQ_API_KEY,
    model:        "llama-3.3-70b-versatile",
    modelVersion: "llama-3.3-70b-versatile@v1",
    maxChars:     12000,
    maxRetries:   2,
  },
  resume: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ] as const,
  },
  scoreCaps: {
    atsScore:        58,  // max ATS score shown to user
    hirabilityIndex: 55,  // max hirability score shown to user
    interviewChance: 48,  // max interview chance shown to user
  },
} as const;

export type AllowedMimeType = typeof config.resume.allowedMimeTypes[number];