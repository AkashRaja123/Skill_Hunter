import type { NextRequest } from "next/server";

import { ok, fail } from "@/lib/api/http";
import { routeError } from "@/lib/api/route-helpers";
import { parseResumeWithGemini, extractTextFromPDF } from "@/lib/services/resume-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeText = formData.get("resumeText") as string;
    const isPDF = formData.get("isPDF") === "true";

    if (!resumeText || resumeText.trim().length === 0) {
      return fail("Resume text is required", 400);
    }

    let textToProcess = resumeText;

    // If it's a PDF sent as base64, decode and parse it
    if (isPDF) {
      try {
        // Decode base64 to buffer and convert to ArrayBuffer
        const buffer = Buffer.from(resumeText, "base64");
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        textToProcess = await extractTextFromPDF(arrayBuffer);
      } catch (error) {
        return fail(`PDF parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`, 400);
      }
    }

    const result = await parseResumeWithGemini(textToProcess);

    return ok(result, 200);
  } catch (error) {
    return routeError(error);
  }
}
