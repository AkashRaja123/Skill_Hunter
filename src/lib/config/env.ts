import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  USE_FIREBASE: z.enum(["true", "false"]).default("false"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required for resume parsing"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
}

export const env = {
  ...parsed.data,
  useFirebase: parsed.data.USE_FIREBASE === "true",
  geminiApiKey: parsed.data.GEMINI_API_KEY
};
