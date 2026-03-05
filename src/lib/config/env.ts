import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  USE_FIREBASE: z.enum(["true", "false"]).default("false"),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required for resume parsing"),
  OPENROUTER_MODEL: z.string().default("arcee-ai/trinity-large-preview:free"),
  OPENROUTER_SITE_URL: z.string().optional(),
  OPENROUTER_APP_NAME: z.string().optional(),
  ADZUNA_APP_ID: z.string().min(1, "ADZUNA_APP_ID is required for job search"),
  ADZUNA_APP_KEY: z.string().min(1, "ADZUNA_APP_KEY is required for job search"),
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
  openRouterApiKey: parsed.data.OPENROUTER_API_KEY,
  openRouterModel: parsed.data.OPENROUTER_MODEL,
  openRouterSiteUrl: parsed.data.OPENROUTER_SITE_URL,
  openRouterAppName: parsed.data.OPENROUTER_APP_NAME ?? "Skill Hunter",
  adzunaAppId: parsed.data.ADZUNA_APP_ID,
  adzunaAppKey: parsed.data.ADZUNA_APP_KEY
};
