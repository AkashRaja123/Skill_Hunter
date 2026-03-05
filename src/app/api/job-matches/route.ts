import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { createId, nowIso } from "@/lib/utils/id";
import { createJobMatchSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const resumeId = req.nextUrl.searchParams.get("resumeId") ?? undefined;
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const data = await getDataSource().listJobMatches({ userId, resumeId, status });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createJobMatchSchema.parse(body);

    const created = await getDataSource().createJobMatch({
      jobMatchId: createId("job"),
      userId: input.userId,
      resumeId: input.resumeId,
      jobDetails: {
        ...input.jobDetails,
        postedDate: input.jobDetails.postedDate.toString()
      },
      matchScore: input.matchScore,
      matchedSkills: input.matchedSkills,
      missingSkills: input.missingSkills,
      fetchedAt: nowIso(),
      isBookmarked: input.isBookmarked,
      status: input.status
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
