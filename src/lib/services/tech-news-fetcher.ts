/**
 * Tech News Fetcher with Industry Trend Analysis
 * Uses NewsAPI-powered articles to identify industry improvements
 */

import { fetchTechNews as fetchNewsApiArticles } from "./news-fetcher";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface IndustryTrend {
  industry: string;
  relevantArticles: NewsArticle[];
  improvementScore: number;
  keyKeywords: string[];
  dailyOutlook: string;
}

interface TechNewsReport {
  fetchedAt: string;
  totalArticles: number;
  topIndustries: IndustryTrend[];
  overallTechMomentum: "positive" | "neutral" | "negative";
  summary: string;
}

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Artificial Intelligence": [
    "AI",
    "LLM",
    "machine learning",
    "neural network",
    "transformer",
    "GPT",
    "Claude",
    "Gemini",
    "deep learning",
    "generative AI",
  ],
  "Quantum Computing": [
    "quantum",
    "qubit",
    "quantum computing",
    "quantum processor",
    "quantum chip",
    "quantum error correction",
  ],
  "Web3 & Blockchain": [
    "blockchain",
    "crypto",
    "web3",
    "NFT",
    "bitcoin",
    "ethereum",
    "smart contract",
    "decentralized",
    "DeFi",
  ],
  "Cloud Computing": [
    "cloud",
    "AWS",
    "Azure",
    "GCP",
    "serverless",
    "kubernetes",
    "containers",
    "edge computing",
    "multi-cloud",
  ],
  "Cybersecurity": [
    "security",
    "cybersecurity",
    "breach",
    "vulnerability",
    "ZeroTrust",
    "threat detection",
    "encryption",
    "malware",
    "SIEM",
  ],
  "Biotech & Healthcare": [
    "biotech",
    "healthcare",
    "medical",
    "drug discovery",
    "genomics",
    "gene therapy",
    "immunotherapy",
    "CRISPR",
    "precision medicine",
  ],
  "Robotics & Automation": [
    "robot",
    "robotics",
    "automation",
    "RPA",
    "autonomous",
    "drone",
    "robotic process",
  ],
  "Green Energy": [
    "renewable energy",
    "solar",
    "wind",
    "battery",
    "EV",
    "electric vehicle",
    "sustainability",
    "carbon",
    "net-zero",
  ],
  "Extended Reality": [
    "VR",
    "AR",
    "metaverse",
    "XR",
    "virtual reality",
    "augmented reality",
    "spatial computing",
    "mixed reality",
  ],
  "5G & Connectivity": [
    "5G",
    "6G",
    "satellite internet",
    "connectivity",
    "network",
    "bandwidth",
    "latency",
  ],
};

async function fetchTechNews(query: string = "technology"): Promise<NewsArticle[]> {
  const articles = await fetchNewsApiArticles(query, "publishedAt", 50);

  // Map NewsAPI article shape into the simplified NewsArticle used here
  return articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt
  }));
}

function analyzeIndustryTrends(articles: NewsArticle[]): IndustryTrend[] {
  const industryScores: Record<string, { articles: NewsArticle[]; keywords: Set<string> }> = {};

  // Initialize industry scores
  Object.keys(INDUSTRY_KEYWORDS).forEach((industry) => {
    industryScores[industry] = { articles: [], keywords: new Set() };
  });

  // Categorize articles
  articles.forEach((article) => {
    const fullText = `${article.title} ${article.description}`.toLowerCase();

    Object.entries(INDUSTRY_KEYWORDS).forEach(([industry, keywords]) => {
      const matchedKeywords = keywords.filter((keyword) =>
        fullText.includes(keyword.toLowerCase())
      );

      if (matchedKeywords.length > 0) {
        industryScores[industry].articles.push(article);
        matchedKeywords.forEach((kw) => industryScores[industry].keywords.add(kw));
      }
    });
  });

  // Create trends with scoring
  const trends: IndustryTrend[] = Object.entries(industryScores)
    .filter(([_, data]) => data.articles.length > 0)
    .map(([industry, data]) => {
      const improvementScore = Math.min(
        100,
        (data.articles.length * 20 + data.keywords.size * 5)
      );

      return {
        industry,
        relevantArticles: data.articles,
        improvementScore,
        keyKeywords: Array.from(data.keywords).slice(0, 5),
        dailyOutlook: generateOutlook(industry, improvementScore, data.articles),
      };
    })
    .sort((a, b) => b.improvementScore - a.improvementScore);

  return trends;
}

function generateOutlook(
  industry: string,
  score: number,
  articles: NewsArticle[]
): string {
  if (score >= 80) {
    return `${industry} is experiencing rapid advancement with multiple breakthroughs. Strong growth momentum expected.`;
  } else if (score >= 60) {
    return `${industry} showing steady progress with notable improvements. Positive market outlook.`;
  } else if (score >= 40) {
    return `${industry} developing steadily with emerging opportunities. Moderate improvement expected.`;
  } else {
    return `${industry} has recent activity. Monitor developments closely.`;
  }
}

export async function generateDailyTechReport(): Promise<TechNewsReport> {
  const articles = await fetchTechNews("technology innovation breakthrough 2026");
  const topIndustries = analyzeIndustryTrends(articles).slice(0, 5);

  const totalPositive = topIndustries.filter((t) => t.improvementScore >= 60).length;
  const overallMomentum: "positive" | "neutral" | "negative" =
    totalPositive >= 4 ? "positive" : totalPositive >= 2 ? "neutral" : "negative";

  const summary =
    topIndustries.length > 0
      ? `Today's tech landscape is ${
          overallMomentum === "positive"
            ? "thriving"
            : overallMomentum === "neutral"
              ? "evolving"
              : "cautious"
        }. ${topIndustries[0].industry} leads industry improvements with ${topIndustries[0].improvementScore}% momentum. ${topIndustries.slice(1, 3).map((t) => t.industry).join(" and ")} also show strong progress.`
      : "Limited tech news available today. Check back soon for updates.";

  return {
    fetchedAt: new Date().toISOString(),
    totalArticles: articles.length,
    topIndustries,
    overallTechMomentum: overallMomentum,
    summary,
  };
}

export async function getTodaysIndustryForecast(): Promise<string> {
  const report = await generateDailyTechReport();

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
        (t) =>
          `• ${t.industry} (${t.improvementScore}%) - ${t.keyKeywords.slice(0, 2).join(", ")}`
      )
      .join("\n")}\n\n` +
    `Overall Tech Momentum: ${report.overallTechMomentum.toUpperCase()}\n` +
    `${report.summary}`;
}
