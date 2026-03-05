/**
 * Fetches technology news from NewsAPI
 * Used to identify trending technologies and domains
 */

import { env } from "@/lib/config/env";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  content?: string;
  author?: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: {
      id?: string;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
}

    
export async function fetchTechNews(
  query: string = "technology",
  sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt",
  pageSize: number = 20
): Promise<NewsArticle[]> {
  if (!env.newsApiKey) {
    console.warn("NEWSAPI_KEY not configured, returning empty results");
    return [];
  }

  try {
    // Use top-headlines endpoint with tech sources
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("sources", "techcrunch,the-verge,wired");
    url.searchParams.set("pageSize", Math.min(pageSize, 1000).toString());
    url.searchParams.set("apiKey", env.newsApiKey);
    url.searchParams.set("language", "en");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "SkillHunter/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`);
    }

    const data = (await response.json()) as NewsAPIResponse;

    if (data.status !== "ok") {
      console.error("NewsAPI returned error status:", data);
      return [];
    }

    return data.articles.map((article) => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      urlToImage: article.urlToImage || undefined,
      publishedAt: article.publishedAt,
      source: article.source,
      content: article.content || undefined,
      author: article.author || undefined
    }));
  } catch (error) {
    console.error("Error fetching tech news:", error);
    return [];
  }
}

/**
 * Fetch news for multiple tech domains
 * @param domains - Array of domain names to search for
 * @param pageSize - Number of articles per domain
 * @returns Object with domain as key and articles as value
 */
export async function fetchTechNewsForDomains(
  domains: string[],
  pageSize: number = 10
): Promise<Record<string, NewsArticle[]>> {
  const results: Record<string, NewsArticle[]> = {};

  // Fetch news for each domain in parallel
  await Promise.all(
    domains.map(async (domain) => {
      try {
        results[domain] = await fetchTechNews(domain, "publishedAt", pageSize);
      } catch (error) {
        console.error(`Error fetching news for domain ${domain}:`, error);
        results[domain] = [];
      }
    })
  );

  return results;
}
