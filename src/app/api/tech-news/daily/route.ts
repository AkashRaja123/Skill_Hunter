import { fetchTechNews } from "@/lib/services/news-fetcher";
import { extractTopicsFromArticles } from "@/lib/services/topic-extractor";
import { generateInsightsFromTrends } from "@/lib/services/insights-generator";
import { getDailyBoomingFromDomainCounts } from "@/lib/services/daily-trends";
import {
  getCachedReport,
  isCacheValid,
  setCachedReport,
  getCacheExpirationTime,
  getFormattedTimeRemaining,
} from "@/lib/cache/tech-news-cache";

export const reusable = true;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Check if we have valid cached data (within 24 hours)
    if (isCacheValid()) {
      const cached = getCachedReport();
      return Response.json(
        {
          success: true,
          data: cached?.data,
          cached: true,
          cacheExpiresAt: getCacheExpirationTime(),
          timeRemaining: getFormattedTimeRemaining(),
          message: "Using cached data from previous fetch",
        },
        { status: 200 }
      );
    }

    // Cache is invalid or doesn't exist, fetch new data
    const articles = await fetchTechNews("technology trending", "publishedAt", 50);

    if (!articles || articles.length === 0) {
      throw new Error("No articles found from NewsAPI");
    }

    // Analyze articles for trends
    const analysis = extractTopicsFromArticles(articles);
    const { trendAnalysis, boomingDomains, topDomain } = getDailyBoomingFromDomainCounts(
      analysis.domains,
      5
    );
    const insights = generateInsightsFromTrends(trendAnalysis.scores, articles.slice(0, 10));

    const report = {
      summary: insights.summary,
      topIndustries: boomingDomains.map((d) => ({
        industry: d.domain,
        improvementScore: d.score,
        keyKeywords: analysis.keywords
          .filter((k) => k.domain === d.domain)
          .slice(0, 3)
          .map((k) => k.keyword),
        dailyOutlook: d.description
      })),
      overallTechMomentum:
        boomingDomains.length > 3 ? "positive" : boomingDomains.length > 1 ? "neutral" : "negative",
      topBoomingDomain: topDomain
    };

    const forecast = formatForecast(report);

    const responseData = {
      report,
      forecast,
      timestamp: new Date().toISOString(),
      articlesAnalyzed: articles.length
    };

    // Store in cache for next 24 hours
    setCachedReport(responseData);

    return Response.json(
      {
        success: true,
        data: responseData,
        cached: false,
        cacheExpiresAt: getCacheExpirationTime(),
        timeRemaining: getFormattedTimeRemaining(),
        message: "Fresh data fetched and cached for 24 hours",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in daily tech report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      {
        success: false,
        error: errorMessage,
        message: "Failed to fetch tech news. Please ensure NEWSAPI_KEY is configured and valid.",
        cached: isCacheValid(),
        cacheExpiresAt: getCacheExpirationTime(),
      },
      { status: 500 }
    );
  }
}

function formatForecast(report: any): string {
  if (report.topIndustries.length === 0) {
    return "No industry trends detected today.";
  }

  const topIndustry = report.topIndustries[0];
  return `🚀 TODAY'S INDUSTRY FORECAST:\n\n` +
    `✨ TOP IMPROVING INDUSTRY: ${topIndustry.industry}\n` +
    `📈 Momentum Score: ${topIndustry.improvementScore}%\n` +
    `💡 Key Focus: ${topIndustry.keyKeywords.join(", ")}\n` +
    `📊 Outlook: ${topIndustry.dailyOutlook}\n\n` +
    `Other Industries to Watch:\n${report.topIndustries
      .slice(1)
      .map(
        (t: any) =>
          `• ${t.industry} (${t.improvementScore}%) - ${t.keyKeywords.slice(0, 2).join(", ")}`
      )
      .join("\n")}\n\n` +
    `Overall Tech Momentum: ${report.overallTechMomentum.toUpperCase()}\n` +
    `${report.summary}`;
}
