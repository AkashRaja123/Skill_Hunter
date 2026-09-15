/**
 * Generates AI insights about technology trends
 * This can use actual AI/LLM or return pre-built insights
 */

import { env } from "@/lib/config/env";
import type { DomainTrendScore } from "./boom-score-calculator";
import type { NewsArticle } from "@/news/services/news-fetcher";

export interface Insight {
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
  category: string;
}

export interface InsightsReport {
  summary: string;
  insights: Insight[];
  jobOpportunities: string[];
  skillsToLearn: string[];
  warnings: string[];
  generatedAt: string;
}

/**
 * Generate text insights based on trends (without AI)
 * Can be replaced with actual LLM calls
 */
export function generateInsightsFromTrends(
  trends: DomainTrendScore[],
  articles: NewsArticle[] = []
): InsightsReport {
  const boomingDomains = trends.filter((t) => t.trend === "booming");
  const growingDomains = trends.filter((t) => t.trend === "growing");
  const stableDomains = trends.filter((t) => t.trend === "stable");

  const insights: Insight[] = [];
  const jobOpportunities: Set<string> = new Set();
  const skillsToLearn: Set<string> = new Set();
  const warnings: string[] = [];

  // Insight 1: Top booming domains
  if (boomingDomains.length > 0) {
    const topBoomers = boomingDomains.slice(0, 3).map((d) => d.domain).join(", ");
    insights.push({
      title: "Exploding Demand in Core Tech Areas",
      description: `${topBoomers} are experiencing explosive growth in job postings and industry investment. Companies are aggressively hiring for these specializations.`,
      importance: "high",
      category: "Trend"
    });

    boomingDomains.forEach((domain) => {
      if (domain.domain.includes("AI")) {
        jobOpportunities.add("Machine Learning Engineer");
        jobOpportunities.add("AI Engineer");
        skillsToLearn.add("Python");
        skillsToLearn.add("TensorFlow/PyTorch");
      }
      if (domain.domain.includes("Cloud")) {
        jobOpportunities.add("Cloud Architect");
        jobOpportunities.add("DevOps Engineer");
        skillsToLearn.add("Kubernetes");
        skillsToLearn.add("AWS/Azure");
      }
      if (domain.domain.includes("Data")) {
        jobOpportunities.add("Data Engineer");
        jobOpportunities.add("Data Scientist");
        skillsToLearn.add("SQL");
        skillsToLearn.add("Apache Spark");
      }
    });
  }

  // Insight 2: Growing opportunities
  if (growingDomains.length > 0) {
    insights.push({
      title: "Emerging Opportunities with Strong Growth",
      description: `${growingDomains.length} domains are in growth phase, offering good career prospects for developers willing to specialize in high-demand areas.`,
      importance: "medium",
      category: "Opportunity"
    });

    growingDomains.forEach((domain) => {
      jobOpportunities.add(`${domain.domain} Specialist`);
    });
  }

  // Insight 3: Market saturation
  if (stableDomains.length > 5) {
    warnings.push(
      "Some traditional tech domains show saturation. Consider specializing in booming areas for better career prospects."
    );
  }

  // Insight 4: Articles analysis
  if (articles.length > 0) {
    const recentArticles = articles.slice(0, 3);
    const topicKeywords = recentArticles.map((a) => a.title).join(" ");

    if (topicKeywords.toLowerCase().includes("openai") || topicKeywords.toLowerCase().includes("gpt")) {
      insights.push({
        title: "LLM Adoption Accelerating",
        description: "Large language models (LLMs) continue to dominate tech news. Companies are rapidly integrating LLM-powered features into products.",
        importance: "high",
        category: "Breaking Trend"
      });
      skillsToLearn.add("Prompt Engineering");
      skillsToLearn.add("OpenAI API");
    }

    if (topicKeywords.toLowerCase().includes("web3") || topicKeywords.toLowerCase().includes("blockchain")) {
      insights.push({
        title: "Web3 Maturing Beyond Hype",
        description: "Enterprise adoption of blockchain technology is increasing, moving beyond cryptocurrency speculation.",
        importance: "medium",
        category: "Emerging"
      });
      skillsToLearn.add("Solidity");
      skillsToLearn.add("Smart Contracts");
    }
  }

  // Insight 5: Skill convergence
  if (skillsToLearn.size > 0) {
    insights.push({
      title: "Cross-Domain Skill Convergence",
      description: "The most valuable developers combine multiple skill domains. Cloud + AI, Data + DevOps, and Full-Stack + Cloud skills are especially valuable.",
      importance: "high",
      category: "Career"
    });
  }

  // Generate summary
  const boomCount = boomingDomains.length;
  const summary =
    boomCount > 0
      ? `Tech market is heating up! ${boomCount} domains are booming. ${growingDomains.length} more are showing strong growth. Focus on ${boomingDomains[0]?.domain || "AI and Cloud"} for maximum opportunity.`
      : "Tech market showing stable trends across domains. Good foundation for continuous learning and specialization.";

  return {
    summary,
    insights,
    jobOpportunities: Array.from(jobOpportunities),
    skillsToLearn: Array.from(skillsToLearn),
    warnings,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate insights using actual AI/LLM (optional)
 * Falls back to basic insights if API key not available
 */
export async function generateAIInsights(
  trends: DomainTrendScore[],
  articles: NewsArticle[] = []
): Promise<InsightsReport> {
  // For now, return basic insights
  // In production, could integrate with OpenRouter or another LLM API
  return generateInsightsFromTrends(trends, articles);
}

/**
 * Format insights for display
 */
export function formatInsightsForDisplay(report: InsightsReport): string {
  const lines: string[] = [];

  lines.push(`📊 Market Analysis (Generated: ${new Date(report.generatedAt).toLocaleString()})`);
  lines.push(`\n${report.summary}\n`);

  if (report.insights.length > 0) {
    lines.push("🔍 Key Insights:");
    report.insights.forEach((insight, i) => {
      lines.push(`\n${i + 1}. ${insight.title}`);
      lines.push(`   ${insight.description}`);
      lines.push(`   Importance: ${insight.importance.toUpperCase()}`);
    });
  }

  if (report.jobOpportunities.length > 0) {
    lines.push("\n💼 Job Opportunities:");
    report.jobOpportunities.slice(0, 5).forEach((opp) => {
      lines.push(`   • ${opp}`);
    });
  }

  if (report.skillsToLearn.length > 0) {
    lines.push("\n📚 In-Demand Skills:");
    report.skillsToLearn.slice(0, 5).forEach((skill) => {
      lines.push(`   • ${skill}`);
    });
  }

  if (report.warnings.length > 0) {
    lines.push("\n⚠️ Warnings:");
    report.warnings.forEach((warning) => {
      lines.push(`   • ${warning}`);
    });
  }

  return lines.join("\n");
}
