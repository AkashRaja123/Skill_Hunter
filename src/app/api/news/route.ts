import { NextRequest, NextResponse } from "next/server";
import { fetchNewsForCategory, parseCategory } from "@/lib/services/news-service";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = parseCategory(searchParams.get("category") ?? undefined);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 12, 1), 20);

  const { articles, error } = await fetchNewsForCategory(category, limit);

  if (error && articles.length === 0) {
    return NextResponse.json({ success: false, error }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: articles });
}
