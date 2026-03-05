import type { NextRequest } from "next/server";
import { ZodError } from "zod";

import { fail } from "@/lib/api/http";

export async function parseBody<T>(req: NextRequest): Promise<T> {
  return (await req.json()) as T;
}

export function routeError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  if (error instanceof Error) {
    return fail(error.message, 500);
  }

  return fail("Unknown server error", 500);
}
