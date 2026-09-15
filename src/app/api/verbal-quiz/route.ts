import { NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/services/quiz-generator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const questions = await generateQuizQuestions("verbal", 5);
    return NextResponse.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error("[API] Verbal quiz generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate verbal questions"
      },
      { status: 500 }
    );
  }
}
