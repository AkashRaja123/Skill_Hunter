/**
 * Calculates trend boom scores for technology domains
 * Measures trend intensity: Booming (100+), Growing (50-99), Stable (0-49)
 */

export interface DomainTrendScore {
  domain: string;
  score: number;
  trend: "booming" | "growing" | "stable";
  description: string;
}

export interface TrendAnalysis {
  scores: DomainTrendScore[];
  timestamp: string;
  totalDomains: number;
  categories: {
    booming: string[];
    growing: string[];
    stable: string[];
  };
}

/**
 * Calculate boom score for a domain based on keyword frequencies
 * Higher frequency = higher boom score
 *
 * Scoring:
 * - Booming: 100+ (trending heavily)
 * - Growing: 50-99 (gaining momentum)
 * - Stable: 0-49 (steady interest)
 */
export function calculateBoomScore(keywordCount: number, totalKeywords: number): number {
  if (totalKeywords === 0) return 0;

  // Normalize to 0-100 scale
  const percentage = (keywordCount / totalKeywords) * 100;

  // Apply curve to emphasize differences
  // Higher percentages get exponentially higher scores
  return Math.round(Math.min(percentage * 1.5, 100));
}

/**
 * Determine trend category based on boom score
 */
export function getTrendCategory(score: number): "booming" | "growing" | "stable" {
  if (score >= 100) return "booming";
  if (score >= 50) return "growing";
  return "stable";
}

/**
 * Get trend description based on score
 */
export function getTrendDescription(score: number, trend: string): string {
  if (score >= 100) {
    return `Explosive growth in ${trend}. Major hiring demand expected.`;
  }
  if (score >= 80) {
    return `Strong upward trend in ${trend}. High market demand.`;
  }
  if (score >= 50) {
    return `Moderate growth in ${trend}. Good career opportunities.`;
  }
  if (score >= 30) {
    return `Steady interest in ${trend}. Stable career path.`;
  }
  return `Emerging interest in ${trend}. Early opportunities available.`;
}

/**
 * Analyze domain frequencies and generate trend scores
 */
export function analyzeDomainTrends(domainCounts: Record<string, number>): TrendAnalysis {
  const totalCount = Object.values(domainCounts).reduce((a, b) => a + b, 0);

  const scores: DomainTrendScore[] = Object.entries(domainCounts)
    .map(([domain, count]) => {
      const score = calculateBoomScore(count, totalCount);
      const trend = getTrendCategory(score);
      const description = getTrendDescription(score, domain);

      return {
        domain,
        score,
        trend,
        description
      };
    })
    .sort((a, b) => b.score - a.score);

  const categories = {
    booming: scores.filter((s) => s.trend === "booming").map((s) => s.domain),
    growing: scores.filter((s) => s.trend === "growing").map((s) => s.domain),
    stable: scores.filter((s) => s.trend === "stable").map((s) => s.domain)
  };

  return {
    scores,
    timestamp: new Date().toISOString(),
    totalDomains: scores.length,
    categories
  };
}

/**
 * Get top booming domains
 */
export function getBoomerDomains(
  domainCounts: Record<string, number>,
  limit: number = 5
): DomainTrendScore[] {
  const analysis = analyzeDomainTrends(domainCounts);
  return analysis.scores
    .filter((s) => s.trend === "booming")
    .slice(0, limit);
}

/**
 * Get hot emerging domains (stable but with potential)
 */
export function getHotEmerging(
  domainCounts: Record<string, number>,
  limit: number = 3
): DomainTrendScore[] {
  const analysis = analyzeDomainTrends(domainCounts);
  return analysis.scores
    .filter((s) => s.score < 30 && s.score > 0)
    .slice(0, limit);
}

/**
 * Calculate week-over-week growth (simplified for mock)
 * In production, would track historical data
 */
export function estimateGrowthRate(domainCounts: Record<string, number>): Record<string, number> {
  const growthRates: Record<string, number> = {};

  Object.entries(domainCounts).forEach(([domain, count]) => {
    // Simulate growth rate: domains with higher scores are growing faster
    // This is a simplified model; real implementation would track history
    const baseGrowth = Math.random() * 20;
    const scoreInfluence = (count / Object.values(domainCounts).reduce((a, b) => a + b)) * 30;

    growthRates[domain] = Math.round(baseGrowth + scoreInfluence);
  });

  return growthRates;
}
