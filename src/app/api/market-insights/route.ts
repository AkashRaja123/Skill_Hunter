import { ok, fail } from "@/lib/api/http";
import { fetchTechNewsForDomains } from "@/news/services/news-fetcher";
import { getAllDomains } from "@/lib/data/domain-mappings";
import { getTopDomainsFromArticles } from "@/lib/services/topic-extractor";
import { getDailyBoomingFromDomainCounts } from "@/lib/services/daily-trends";
import { generateInsightsFromTrends } from "@/lib/services/insights-generator";

export const reusable = true;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get list of tech domains to search for
    const domains = getAllDomains();

    // Fetch news for top domains (limit to 5 for performance)
    const topDomains = domains.slice(0, 5);
    const newsByDomain = await fetchTechNewsForDomains(topDomains, 5);

    // Extract all articles
    const allArticles = Object.values(newsByDomain).flat();

    if (allArticles.length === 0) {
      return fail("No articles found. Please ensure NEWSAPI_KEY is configured.", 503);
    }

    // Extract topics and calculate trend scores
    const domainFrequencies = getTopDomainsFromArticles(allArticles, domains.length);
    const domainCounts = Object.fromEntries(
      domainFrequencies.map((d) => [d.domain, d.count])
    );

    const { trendAnalysis, boomingDomains, topDomain } = getDailyBoomingFromDomainCounts(
      domainCounts,
      5
    );
    const insights = generateInsightsFromTrends(trendAnalysis.scores, allArticles);

    return ok({
      summary: insights.summary,
      insights: insights.insights,
      jobOpportunities: insights.jobOpportunities.slice(0, 10),
      skillsToLearn: insights.skillsToLearn.slice(0, 10),
      warnings: insights.warnings,
      boomingDomains,
      topBoomingDomain: topDomain,
      generatedAt: insights.generatedAt,
      sampledArticles: allArticles.length
    });
  } catch (error) {
    console.error("Error generating market insights:", error);
    return fail(
      error instanceof Error ? error.message : "Failed to generate market insights",
      500
    );
  }
}
