import { ok, fail } from "@/lib/api/http";
import { fetchTechNews, fetchTechNewsForDomains } from "@/news/services/news-fetcher";
import { getAllDomains } from "@/lib/data/domain-mappings";
import { extractTopicsFromArticles, getTopDomainsFromArticles } from "@/lib/services/topic-extractor";
import { getDailyBoomingFromDomainCounts } from "@/lib/services/daily-trends";

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

    return ok({
      domains: trendAnalysis.scores,
      categories: trendAnalysis.categories,
      totalDomains: trendAnalysis.totalDomains,
      sampledArticles: allArticles.length,
      timestamp: trendAnalysis.timestamp,
      boomingDomains,
      topBoomingDomain: topDomain
    });
  } catch (error) {
    console.error("Error analyzing trending domains:", error);
    return fail(
      error instanceof Error ? error.message : "Failed to analyze trending domains",
      500
    );
  }
}
