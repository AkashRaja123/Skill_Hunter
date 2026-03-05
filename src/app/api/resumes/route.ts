import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { createId, nowIso } from "@/lib/utils/id";
import { createResumeSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const resumeId = req.nextUrl.searchParams.get("resumeId") ?? undefined;
    const data = await getDataSource().listResumes({ userId, resumeId });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createResumeSchema.parse(body);
    const now = nowIso();

    const created = await getDataSource().createResume({
      resumeId: createId("resume"),
      userId: input.userId,
      uploadedAt: now,
      lastModifiedAt: now,
      parsedData: input.parsedData,
      aiAnalysis: input.aiAnalysis
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
