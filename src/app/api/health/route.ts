import { ok } from "@/lib/api/http";

export async function GET() {
  return ok({ status: "ok", service: "skill-hunter-api", timestamp: new Date().toISOString() });
}
