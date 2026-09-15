import { fetchTechNews } from "@/lib/services/news-fetcher";
import { extractTopicsFromArticles, extractKeywordsFromText } from "@/lib/services/topic-extractor";
import { generateInsightsFromTrends } from "@/lib/services/insights-generator";
import { getDailyBoomingFromDomainCounts } from "@/lib/services/daily-trends";
import { getRolesForDomain } from "@/lib/data/role-mappings";

export const reusable = true;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch latest tech news from NewsAPI
    const articles = await fetchTechNews("technology trending", "publishedAt", 30);

    if (!articles || articles.length === 0) {
      return Response.json(
        {
          success: false,
          error: "No articles found",
          message: "Failed to fetch tech news. Please ensure NEWSAPI_KEY is configured and valid."
        },
        { status: 503 }
      );
    }

    // Analyze articles for trends
    const analysis = extractTopicsFromArticles(articles);
    const { trendAnalysis, boomingDomains, topDomain } = getDailyBoomingFromDomainCounts(
      analysis.domains,
      5
    );
    const insights = generateInsightsFromTrends(trendAnalysis.scores, articles.slice(0, 10));

    // Extract domain impact for each article
    const articlesWithImpact = articles.slice(0, 15).map((article) => {
      const text = `${article.title} ${article.description}`;
      const keywords = extractKeywordsFromText(text);
      const affectedDomains = Array.from(new Set(keywords.map((k) => k.domain).filter(Boolean)));

      // Get trend scores for affected domains
      const domainScores = affectedDomains.map((domain) => {
        const trend = trendAnalysis.scores.find((t) => t.domain === domain);
        return {
          domain: domain!,
          score: trend?.score || 0,
          trend: trend?.trend || "stable"
        };
      });

      // Get job roles for affected domains
      const relatedJobs = affectedDomains.flatMap((domain) => 
        getRolesForDomain(domain!).slice(0, 3)
      );

      return {
        ...article,
        affectedDomains: domainScores,
        relatedJobs: Array.from(new Set(relatedJobs)).slice(0, 5),
        keywordMatches: keywords.slice(0, 5).map((k) => k.keyword)
      };
    });

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
      fetchedAt: new Date().toISOString(),
      topBoomingDomain: topDomain
    };

    const forecast = `${insights.summary} Key opportunities: ${insights.jobOpportunities.slice(0, 3).join(", ")}`;

    // Build domain job roles map
    const domainJobRoles: Record<string, string[]> = {};
    trendAnalysis.scores.forEach((trend) => {
      domainJobRoles[trend.domain] = getRolesForDomain(trend.domain).slice(0, 5);
    });

    return Response.json(
      {
        success: true,
        forecast,
        report,
        articles: articlesWithImpact,
        trendAnalysis: trendAnalysis.scores,
        domainJobRoles,
        insights,
        timestamp: new Date().toISOString(),
        articlesAnalyzed: articles.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating tech news:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      {
        success: false,
        error: errorMessage,
        message: "Failed to fetch tech news. Please ensure NEWSAPI_KEY is configured and valid."
      },
      { status: 500 }
    );
  }
}
