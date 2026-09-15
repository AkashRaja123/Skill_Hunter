/**
 * Extracts technology topics and keywords from news articles
 * Uses simple keyword matching and frequency analysis
 */

import { getDomainForKeyword, domainMappings } from "@/lib/data/domain-mappings";
import type { NewsArticle } from "@/news/services/news-fetcher";

export interface ExtractedKeyword {
  keyword: string;
  count: number;
  domain?: string;
}

export interface TopicAnalysis {
  keywords: ExtractedKeyword[];
  domains: Record<string, number>;
}

/**
 * Extract keywords from text using domain keywords
 * Simple approach: check if domain keywords appear in text
 */
export function extractKeywordsFromText(text: string): ExtractedKeyword[] {
  const keywords = new Map<string, number>();

  // Get all keywords from domain mappings
  const allKeywords = new Set<string>();
  domainMappings.forEach((mapping) => {
    mapping.keywords.forEach((k) => allKeywords.add(k));
  });

  // Count keyword occurrences in text (case-insensitive)
  const lowerText = text.toLowerCase();
  allKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      keywords.set(keyword, (keywords.get(keyword) || 0) + matches.length);
    }
  });

  // Convert to array and sort by frequency
  return Array.from(keywords.entries())
    .map(([keyword, count]) => ({
      keyword,
      count,
      domain: getDomainForKeyword(keyword) || undefined
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract topics from multiple articles
 */
export function extractTopicsFromArticles(articles: NewsArticle[]): TopicAnalysis {
  const allKeywords = new Map<string, ExtractedKeyword>();
  const domainCounts = new Map<string, number>();

  articles.forEach((article) => {
    // Combine title and description for analysis
    const text = `${article.title} ${article.description}`;

    const keywordsInArticle = extractKeywordsFromText(text);
    keywordsInArticle.forEach((kw) => {
      const existing = allKeywords.get(kw.keyword) || kw;
      existing.count += kw.count;
      allKeywords.set(kw.keyword, existing);

      // Count domain mentions
      if (kw.domain) {
        domainCounts.set(kw.domain, (domainCounts.get(kw.domain) || 0) + kw.count);
      }
    });
  });

  return {
    keywords: Array.from(allKeywords.values()).sort((a, b) => b.count - a.count),
    domains: Object.fromEntries(domainCounts)
  };
}

/**
 * Get top domains from articles
 */
export function getTopDomainsFromArticles(
  articles: NewsArticle[],
  limit: number = 10
): { domain: string; count: number }[] {
  const analysis = extractTopicsFromArticles(articles);

  return Object.entries(analysis.domains)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Aggregate keywords by domain
 */
export function aggregateKeywordsByDomain(keywords: ExtractedKeyword[]): Record<string, number> {
  const domainCounts = new Map<string, number>();

  keywords.forEach((kw) => {
    if (kw.domain) {
      domainCounts.set(kw.domain, (domainCounts.get(kw.domain) || 0) + kw.count);
    }
  });

  return Object.fromEntries(domainCounts);
}
