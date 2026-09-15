import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { nowIso } from "@/lib/utils/id";
import { createUserSchema } from "@/lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email") ?? undefined;
    const userId = req.nextUrl.searchParams.get("userId") ?? undefined;
    const data = await getDataSource().listUsers({ email, userId });
    return ok(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = createUserSchema.parse(body);

    const created = await getDataSource().createUser({
      userId: input.userId,
      email: input.email,
      displayName: input.displayName,
      role: input.role,
      isJobSeeker: input.role !== "hr_recruiter",
      createdAt: nowIso(),
      lastLoginAt: nowIso(),
      profileComplete: input.profileComplete,
      metadata: {
        totalResumesUploaded: 0,
        totalJobsApplied: 0,
        averageATSScore: 0
      }
    });

    return ok(created, 201);
  } catch (error) {
    return routeError(error);
  }
}
