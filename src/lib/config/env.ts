import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  USE_FIREBASE: z.enum(["true", "false"]).default("false"),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required for resume parsing"),
  OPENROUTER_SITE_URL: z.string().url().optional(),
  OPENROUTER_APP_NAME: z.string().optional(),
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
  openRouterSiteUrl: parsed.data.OPENROUTER_SITE_URL,
  openRouterAppName: parsed.data.OPENROUTER_APP_NAME ?? "Skill Hunter"
};
