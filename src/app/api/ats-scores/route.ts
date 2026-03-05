import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { computeAtsScore } from "@/lib/services/ats";
import { createId, nowIso } from "@/lib/utils/id";
import { createATSScoreSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const jobMatchId = req.nextUrl.searchParams.get("jobMatchId") ?? undefined;
    const resumeId = req.nextUrl.searchParams.get("resumeId") ?? undefined;
    const data = await getDataSource().listATSScores({ userId, jobMatchId, resumeId });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createATSScoreSchema.parse(body);
    const score = input.score ?? computeAtsScore(input.scoreBreakdown);
    const previousScore = input.previousScore;

    const created = await getDataSource().createATSScore({
      atsScoreId: createId("ats"),
      userId: input.userId,
      resumeId: input.resumeId,
      jobMatchId: input.jobMatchId,
      score,
      calculatedAt: nowIso(),
      version: input.version,
      scoreBreakdown: input.scoreBreakdown,
      suggestions: input.suggestions,
      previousScore,
      improvement: previousScore === undefined ? undefined : score - previousScore,
      passedThreshold: score >= 90
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
