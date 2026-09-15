import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/http";
import { routeError } from "@/lib/api/route-helpers";
import { seedDummyData } from "@/lib/db/seed";

export async function POST(req: NextRequest) {
  try {
    // Optional: Add a simple secret check for security
    const authHeader = req.headers.get("authorization");
    const secret = process.env.SEED_SECRET || "seed-secret";

    if (!authHeader || !authHeader.endsWith(secret)) {
      return fail("Unauthorized: provide valid SEED_SECRET in Authorization header", 401);
    }

    const result = await seedDummyData();
    return ok(result, 201);
  } catch (error) {
    return routeError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    return ok({
      message: "To seed dummy data, POST to this endpoint with Authorization header",
      example: "curl -X POST http://localhost:3000/api/seed -H 'Authorization: Bearer seed-secret'",
      note: "Set SEED_SECRET environment variable for security",
    });
  } catch (error) {
    return routeError(error);
  }
}
