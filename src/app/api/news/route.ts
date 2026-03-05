import { NextRequest, NextResponse } from "next/server";

type NewsCategory = "technology" | "business" | "career";
type SocietalImpact = "growth" | "liability" | "mixed";

interface NewsApiArticle {
  source?: { name?: string };
  author?: string | null;
  title?: string;
  description?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
}

interface NormalizedArticle {
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

interface ImpactAnalysis {
  societalImpact: SocietalImpact;
  impactReason: string;
  impactScore: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop";

const CATEGORY_QUERIES: Record<NewsCategory, string> = {
  technology: "technology software engineering ai cloud",
  business: "business startup funding hiring market",
  career: "career jobs resume interview remote work"
};

const GROWTH_KEYWORDS = [
  "growth",
  "improve",
  "innovation",
  "hiring",
  "jobs",
  "upskill",
  "funding",
  "education",
  "health",
  "access",
  "clean",
  "sustainable",
  "efficiency",
  "opportunity",
  "inclusion"
];

const LIABILITY_KEYWORDS = [
  "layoff",
  "risk",
  "harm",
  "bias",
  "privacy",
  "breach",
  "pollution",
  "shortage",
  "inequality",
  "fraud",
  "disruption",
  "misuse",
  "addiction",
  "unemployment",
  "lawsuit"
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawCategory = searchParams.get("category");
    const rawLimit = searchParams.get("limit");

    const category: NewsCategory =
      rawCategory === "business" || rawCategory === "career" || rawCategory === "technology"
        ? rawCategory
        : "technology";

    const limit = Math.min(Math.max(Number(rawLimit) || 10, 1), 20);
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        data: getMockNews(category, limit),
        meta: { source: "mock" }
      });
    }

    const query = encodeURIComponent(CATEGORY_QUERIES[category]);
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=${limit}&sortBy=publishedAt&apiKey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 60 * 30 }
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `News provider request failed (${response.status})` },
        { status: 502 }
      );
    }

    const json = (await response.json()) as { status?: string; articles?: NewsApiArticle[] };

    if (json.status !== "ok" || !Array.isArray(json.articles)) {
      return NextResponse.json(
        { success: false, error: "Unexpected response from news provider" },
        { status: 502 }
      );
    }

    const data = json.articles
      .filter((article) => article.title && article.url)
      .map((article, index) => normalizeArticle(article, index));

    return NextResponse.json({
      success: true,
      data,
      meta: { source: "newsapi", count: data.length }
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load news" }, { status: 500 });
  }
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
    impactScore: impact.impactScore
  };
}

function getMockNews(category: NewsCategory, limit: number): NormalizedArticle[] {
  const now = Date.now();
  const seed: Record<NewsCategory, string[]> = {
    technology: [
      "AI copilots are changing software teams in 2026",
      "Cloud hiring grows as companies modernize legacy systems",
      "Cybersecurity demand remains strong across all regions",
      "Product engineering teams prioritize TypeScript and Rust"
    ],
    business: [
      "Funding rebounds for B2B startups this quarter",
      "Mid-size firms increase hiring for data roles",
      "Global companies expand hybrid work policies",
      "Leaders invest in upskilling and internal mobility"
    ],
    career: [
      "How to tailor your resume for ATS and recruiters",
      "Interview prep: frameworks that improve confidence",
      "Building a portfolio that gets responses",
      "Career switches: a 90-day transition roadmap"
    ]
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
      impactScore: impact.impactScore
    };
  });
}

function analyzeSocietalImpact(title: string, description: string): ImpactAnalysis {
  const text = `${title} ${description}`.toLowerCase();
  const growthHits = GROWTH_KEYWORDS.filter((keyword) => text.includes(keyword));
  const liabilityHits = LIABILITY_KEYWORDS.filter((keyword) => text.includes(keyword));

  const rawScore = growthHits.length * 18 - liabilityHits.length * 20;
  const impactScore = Math.max(-100, Math.min(100, rawScore));

  const societalImpact: SocietalImpact =
    impactScore > 15 ? "growth" : impactScore < -15 ? "liability" : "mixed";

  const topGrowth = growthHits.slice(0, 2).join(", ");
  const topLiability = liabilityHits.slice(0, 2).join(", ");

  if (societalImpact === "growth") {
    return {
      societalImpact,
      impactScore,
      impactReason: topGrowth
        ? `Likely social growth via ${topGrowth}.`
        : "Likely social growth through jobs, access, and productivity gains."
    };
  }

  if (societalImpact === "liability") {
    return {
      societalImpact,
      impactScore,
      impactReason: topLiability
        ? `Potential social liability from ${topLiability}.`
        : "Potential social liability due to risk, privacy, or inequality concerns."
    };
  }

  const mixedSignal = [topGrowth, topLiability].filter(Boolean).join(" and ");
  return {
    societalImpact,
    impactScore,
    impactReason: mixedSignal
      ? `Mixed social signals around ${mixedSignal}.`
      : "Mixed social impact with both opportunities and risks."
  };
}
