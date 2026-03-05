import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { createId, nowIso } from "@/lib/utils/id";
import { createApplicationSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const data = await getDataSource().listApplications({ userId, status });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createApplicationSchema.parse(body);

    const created = await getDataSource().createApplication({
      applicationId: createId("app"),
      userId: input.userId,
      resumeId: input.resumeId,
      jobMatchId: input.jobMatchId,
      appliedAt: nowIso(),
      finalATSScore: input.finalATSScore,
      applicationStatus: input.applicationStatus,
      statusHistory: input.statusHistory,
      interviewDetails: input.interviewDetails,
      notes: input.notes,
      followUpDate: input.followUpDate
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
