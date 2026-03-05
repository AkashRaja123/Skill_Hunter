import type { NextRequest } from "next/server";

import { ok } from "@/lib/api/http";
import { parseBody, routeError } from "@/lib/api/route-helpers";
import { getDataSource } from "@/lib/db";
import { createId, nowIso } from "@/lib/utils/id";
import { createApplicationSchema, updateApplicationSchema, bulkUpdateApplicationSchema } from "@/lib/validation/schemas";

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = updateApplicationSchema.parse(body);
    const ds = getDataSource();
    const now = nowIso();

    const updates: Record<string, unknown> = {};

    if (input.applicationStatus) {
      updates.applicationStatus = input.applicationStatus;
      // Fetch current to append statusHistory
      const current = (await ds.listApplications()). find(a => a.applicationId === input.applicationId);
      if (current) {
        updates.statusHistory = [
          ...current.statusHistory,
          { status: input.applicationStatus, updatedAt: now, notes: input.notes }
        ];
      }
    }

    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.followUpDate !== undefined) updates.followUpDate = input.followUpDate;
    if (input.interviewDetails !== undefined) updates.interviewDetails = input.interviewDetails;

    const updated = await ds.updateApplication(input.applicationId, updates);
    return ok(updated);
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await parseBody(req);
    const input = bulkUpdateApplicationSchema.parse(body);
    const ds = getDataSource();
    const now = nowIso();

    const results = await Promise.all(
      input.applicationIds.map(async (id) => {
        const current = (await ds.listApplications()).find(a => a.applicationId === id);
        const statusHistory = current
          ? [...current.statusHistory, { status: input.applicationStatus, updatedAt: now }]
          : [{ status: input.applicationStatus, updatedAt: now }];

        return ds.updateApplication(id, {
          applicationStatus: input.applicationStatus,
          statusHistory
        });
      })
    );

    return ok(results);
  } catch (error) {
    return routeError(error);
  }
}
