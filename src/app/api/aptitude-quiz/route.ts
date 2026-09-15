import { NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/services/quiz-generator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const questions = await generateQuizQuestions("aptitude", 5);
    return NextResponse.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error("[API] Aptitude quiz generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate aptitude questions"
      },
      { status: 500 }
    );
  }
}
