import { ok, fail } from "@/lib/api/http";
import { fetchTechNewsForDomains, type NewsArticle } from "@/news/services/news-fetcher";
import { getAllDomains } from "@/lib/data/domain-mappings";
import { getTopDomainsFromArticles } from "@/lib/services/topic-extractor";
import { analyzeDomainTrends } from "@/lib/services/boom-score-calculator";
import { getRolesForDomain } from "@/lib/data/role-mappings";

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

    const trendAnalysis = analyzeDomainTrends(domainCounts);

    // Map trending domains to job roles
    const trendingJobRoles = new Map<string, { domain: string; score: number; roles: string[] }>();

    trendAnalysis.scores.slice(0, 10).forEach((trend) => {
      const roles = getRolesForDomain(trend.domain);
      if (roles.length > 0) {
        trendingJobRoles.set(trend.domain, {
          domain: trend.domain,
          score: trend.score,
          roles: roles.slice(0, 5) // Top 5 roles per domain
        });
      }
    });

    const jobsByTrendingDomains = Array.from(trendingJobRoles.values());

    return ok({
      jobsByDomain: jobsByTrendingDomains,
      totalDomains: jobsByTrendingDomains.length,
      totalJobRoles: jobsByTrendingDomains.reduce((sum, j) => sum + j.roles.length, 0),
      sampledArticles: allArticles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error analyzing trending jobs:", error);
    return fail(
      error instanceof Error ? error.message : "Failed to analyze trending jobs",
      500
    );
  }
}
