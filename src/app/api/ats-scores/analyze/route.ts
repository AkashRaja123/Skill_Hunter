import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { analyzeResumeVsJob } from "@/lib/services/ats-analyzer";
import { analyzeAtsSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = analyzeAtsSchema.parse(body);
    const result = await analyzeResumeVsJob(
      input.parsedData,
      input.jobTitle,
      input.jobDescription
    );
    return ok(result);
  } catch (error) {
    return routeError(error);
  }
}
