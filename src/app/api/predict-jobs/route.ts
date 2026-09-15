import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { fetchJobsForRole } from "@/lib/services/job-fetcher";
import { predictJobsSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = predictJobsSchema.parse(body);
    const jobs = await fetchJobsForRole(input.role, input.location);
    return ok(jobs);
  } catch (error) {
    return routeError(error);
  }
}
