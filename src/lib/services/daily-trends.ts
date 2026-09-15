import type { TrendAnalysis, DomainTrendScore } from "./boom-score-calculator";
import { analyzeDomainTrends } from "./boom-score-calculator";

export interface DailyBoomingDomainsResult {
  trendAnalysis: TrendAnalysis;
  boomingDomains: DomainTrendScore[];
  topDomain: DomainTrendScore | null;
}

/**
 * Compute daily booming domains from aggregated domain counts.
 *
 * This is the single place that defines how we:
 * - interpret domain keyword frequencies
 * - classify which domains are considered "booming"
 * - pick the top N booming domains and the #1 domain for the day
 */
export function getDailyBoomingFromDomainCounts(
  domainCounts: Record<string, number>,
  limit: number = 5
): DailyBoomingDomainsResult {
  const trendAnalysis = analyzeDomainTrends(domainCounts);

  const boomingDomains = trendAnalysis.scores
    .filter((score) => score.trend === "booming")
    .slice(0, limit);

  return {
    trendAnalysis,
    boomingDomains,
    topDomain: boomingDomains[0] ?? null
  };
}

