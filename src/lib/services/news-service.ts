/**
 * Shared news fetching service used by both the /api/news route handler
 * and the server-rendered news page (to avoid an extra HTTP hop at SSR time).
 */

import { env } from "@/lib/config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NewsCategory = "technology" | "business" | "career";
export type SocietalImpact = "growth" | "liability" | "mixed";

export interface NormalizedArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  author: string | null;
  societalImpact: SocietalImpact;
  impactReason: string;
  impactScore: number;
}

interface NewsApiArticle {
  source?: { name?: string };
  author?: string | null;
  title?: string;
  description?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop";

export const CATEGORY_QUERIES: Record<NewsCategory, string> = {
  technology: "technology software engineering ai cloud",
  business: "business startup funding hiring market",
  career: "career jobs resume interview remote work",
};

const GROWTH_KEYWORDS = [
  "growth", "improve", "innovation", "hiring", "jobs", "upskill", "funding",
  "education", "health", "access", "clean", "sustainable", "efficiency",
  "opportunity", "inclusion",
];

const LIABILITY_KEYWORDS = [
  "layoff", "risk", "harm", "bias", "privacy", "breach", "pollution",
  "shortage", "inequality", "fraud", "disruption", "misuse", "addiction",
  "unemployment", "lawsuit",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function analyzeSocietalImpact(
  title: string,
  description: string,
): { societalImpact: SocietalImpact; impactReason: string; impactScore: number } {
  const text = `${title} ${description}`.toLowerCase();
  const growthHits = GROWTH_KEYWORDS.filter((k) => text.includes(k)).length;
  const liabilityHits = LIABILITY_KEYWORDS.filter((k) => text.includes(k)).length;

  let societalImpact: SocietalImpact;
  let impactScore: number;

  if (growthHits > liabilityHits) {
    societalImpact = "growth";
    impactScore = Math.min(100, growthHits * 15 - liabilityHits * 5);
  } else if (liabilityHits > growthHits) {
    societalImpact = "liability";
    impactScore = Math.max(-100, -(liabilityHits * 15 - growthHits * 5));
  } else {
    societalImpact = "mixed";
    impactScore = 0;
  }

  const impactReason =
    societalImpact === "growth"
      ? "This article covers topics associated with economic or social progress."
      : societalImpact === "liability"
        ? "This article touches on risks or negative outcomes for society."
        : "This article presents a mix of positive and negative implications.";

  return { societalImpact, impactReason, impactScore };
}

function normalizeArticle(article: NewsApiArticle, index: number): NormalizedArticle {
  const title = article.title ?? "Untitled";
  const description = article.description ?? "No description available for this article.";
  const impact = analyzeSocietalImpact(title, description);

  return {
    id: article.url ?? `article-${index}`,
    title,
    description,
    url: article.url ?? "#",
    image: article.urlToImage ?? FALLBACK_IMAGE,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    source: article.source?.name ?? "News Desk",
    author: article.author ?? null,
    societalImpact: impact.societalImpact,
    impactReason: impact.impactReason,
    impactScore: impact.impactScore,
  };
}

function getMockNews(category: NewsCategory, limit: number): NormalizedArticle[] {
  const now = Date.now();
  const seed: Record<NewsCategory, string[]> = {
    technology: [
      "AI copilots are changing software teams in 2026",
      "Cloud hiring grows as companies modernize legacy systems",
      "Cybersecurity demand remains strong across all regions",
      "Product engineering teams prioritize TypeScript and Rust",
    ],
    business: [
      "Funding rebounds for B2B startups this quarter",
      "Mid-size firms increase hiring for data roles",
      "Global companies expand hybrid work policies",
      "Leaders invest in upskilling and internal mobility",
    ],
    career: [
      "How to tailor your resume for ATS and recruiters",
      "Interview prep: frameworks that improve confidence",
      "Building a portfolio that gets responses",
      "Career switches: a 90-day transition roadmap",
    ],
  };

  return seed[category].slice(0, limit).map((title, i) => {
    const description =
      "Curated update from Skill Hunter. Add NEWS_API_KEY in .env.local to fetch live headlines from your provider.";
    const impact = analyzeSocietalImpact(title, description);

    return {
      id: `${category}-${i}`,
      title,
      description,
      url: "#",
      image: FALLBACK_IMAGE,
      publishedAt: new Date(now - i * 1000 * 60 * 90).toISOString(),
      source: "Skill Hunter News",
      author: null,
      societalImpact: impact.societalImpact,
      impactReason: impact.impactReason,
      impactScore: impact.impactScore,
    };
  });
}

export function parseCategory(raw: string | undefined): NewsCategory {
  if (raw === "business" || raw === "career" || raw === "technology") return raw;
  return "technology";
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetches and normalises news articles for a given category.
 * The underlying fetch is cached by Next.js for 30 minutes via
 * `next: { revalidate: 1800 }` so repeated calls within that window
 * are served from the cache without hitting the upstream API.
 */
export async function fetchNewsForCategory(
  category: NewsCategory,
  limit: number = 12,
): Promise<{ articles: NormalizedArticle[]; error: string | null }> {
  try {
    const apiKey = env.newsApiKey;

    if (!apiKey) {
      return { articles: getMockNews(category, limit), error: null };
    }

    const query = encodeURIComponent(CATEGORY_QUERIES[category]);
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=${limit}&sortBy=publishedAt&apiKey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 60 * 30 }, // cache upstream response for 30 min
    });

    if (!response.ok) {
      return {
        articles: [],
        error: `News provider request failed (${response.status})`,
      };
    }

    const json = (await response.json()) as {
      status?: string;
      articles?: NewsApiArticle[];
    };

    if (json.status !== "ok" || !Array.isArray(json.articles)) {
      return { articles: [], error: "Unexpected response from news provider" };
    }

    const articles = json.articles
      .filter((a) => a.title && a.url)
      .map((a, i) => normalizeArticle(a, i));

    return { articles, error: null };
  } catch {
    return { articles: getMockNews(category, limit), error: null };
  }
}
