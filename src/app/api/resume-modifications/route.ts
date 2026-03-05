import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { createId, nowIso } from "@/lib/utils/id";
import { createResumeModificationSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const jobMatchId = req.nextUrl.searchParams.get("jobMatchId") ?? undefined;
    const data = await getDataSource().listResumeModifications({ userId, jobMatchId });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createResumeModificationSchema.parse(body);

    const created = await getDataSource().createResumeModification({
      modificationId: createId("mod"),
      userId: input.userId,
      originalResumeId: input.originalResumeId,
      jobMatchId: input.jobMatchId,
      atsScoreId: input.atsScoreId,
      modifiedAt: nowIso(),
      modificationType: input.modificationType,
      changes: input.changes,
      modifiedResumeData: input.modifiedResumeData,
      status: input.status
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
