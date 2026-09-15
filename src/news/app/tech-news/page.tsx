"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

interface IndustryTrend {
  industry: string;
  improvementScore: number;
  keyKeywords: string[];
  dailyOutlook: string;
}

interface TechReport {
  topIndustries: IndustryTrend[];
  overallTechMomentum: "positive" | "neutral" | "negative";
  summary: string;
  fetchedAt: string;
}

interface DomainScore {
  domain: string;
  score: number;
  trend: "booming" | "growing" | "stable";
}

interface ArticleWithImpact {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
  affectedDomains: DomainScore[];
  relatedJobs: string[];
  keywordMatches: string[];
}

interface TrendScore {
  domain: string;
  score: number;
  trend: "booming" | "growing" | "stable";
  description: string;
}

export default function TechNewsPage() {
  const [report, setReport] = useState<TechReport | null>(null);
  const [forecast, setForecast] = useState<string>("");
  const [articles, setArticles] = useState<ArticleWithImpact[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "booming":
        return { label: "🔥 Booming", color: "bg-red-600/30 text-red-200 border border-red-500/50" };
      case "growing":
        return { label: "📈 Growing", color: "bg-yellow-600/30 text-yellow-200 border border-yellow-500/50" };
      case "stable":
        return { label: "✅ Stable", color: "bg-green-600/30 text-green-200 border border-green-500/50" };
      default:
        return { label: "Status", color: "bg-gray-600/30 text-gray-200 border border-gray-500/50" };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tech-news");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || errorData.message || `API error: ${response.status}`
          );
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || data.message || "Failed to fetch data");
        }
        
        setReport(data.report);
        setForecast(data.forecast);
        setArticles(data.articles || []);
        setTrendAnalysis(data.trendAnalysis || []);
      } catch (err) {
        console.error("Error fetching tech news:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tech news");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-transparent">
      <SiteNavbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-950 mb-2">
            Daily Industry Forecast
          </h1>
          <p className="text-xl text-slate-600">
            Which industries are improving today? Real-time tech news analysis
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-600 text-center">Analyzing latest tech news...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-8 mb-8">
            <p className="text-red-700 text-lg font-semibold mb-4">⚠️ Error Loading Tech News</p>
            <p className="text-red-600 mb-4 whitespace-pre-wrap font-mono text-sm">{error}</p>
            <div className="bg-red-100 border border-red-200 rounded p-4 mt-4">
              <h3 className="font-semibold text-red-700 mb-2">Quick Fix:</h3>
              <ol className="list-decimal list-inside text-red-600 space-y-1 text-sm">
                <li>
                  Check your <code className="bg-white px-2 py-1 rounded border">NEWSAPI_KEY</code> is
                  set in your <code className="bg-white px-2 py-1 rounded border">.env.local</code>{" "}
                  file
                </li>
                <li>
                  Get a free API key from{" "}
                  <a
                    href="https://newsapi.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-red-800"
                  >
                    newsapi.org
                  </a>
                </li>
                <li>
                  Restart your dev server:{" "}
                  <code className="bg-white px-2 py-1 rounded border">npm run dev</code>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Report Data */}
        {report && !loading && (
          <div>
            {/* Top News Articles */}
            {articles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-950 mb-6">📰 Latest Tech News</h2>
                <div className="grid gap-6">
                  {articles.map((article, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-slate-200 hover:border-blue-500 transition-all overflow-hidden shadow-sm"
                    >
                      <div className="md:flex">
                        {/* Article Image */}
                        {article.urlToImage && (
                          <div className="md:w-64 md:flex-shrink-0">
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-48 md:h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="p-6 flex-1">
                          {/* Source and Date */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {article.source.name}
                            </span>
                            <span className="text-slate-500 text-sm">
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-slate-950 mb-3 hover:text-blue-600">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {article.title}
                            </a>
                          </h3>

                          {/* Description */}
                          <p className="text-slate-600 mb-4">{article.description}</p>

                          {/* Affected Domains */}
                          {article.affectedDomains.length > 0 && (
                            <div className="mb-4">
                              <p className="text-slate-600 text-sm font-semibold mb-2">
                                🎯 Domain Impact:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {article.affectedDomains.map((domain, idx) => (
                                  <div
                                    key={idx}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      domain.trend === "booming"
                                        ? "bg-red-100 text-red-700 border border-red-300"
                                        : domain.trend === "growing"
                                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                          : "bg-green-100 text-green-700 border border-green-300"
                                    }`}
                                  >
                                    {domain.domain} ({domain.score})
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Job Roles */}
                          {article.relatedJobs.length > 0 && (
                            <div className="mb-4">
                              <p className="text-slate-600 text-sm font-semibold mb-2">
                                💼 Top Job Roles:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {article.relatedJobs.map((job, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs border border-purple-200"
                                  >
                                    {job}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Keywords */}
                          {article.keywordMatches.length > 0 && (
                            <div>
                              <p className="text-slate-600 text-sm font-semibold mb-2">
                                🔑 Key Technologies:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {article.keywordMatches.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trend Analysis Section */}
            {trendAnalysis.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-950 mb-6">📊 Trend Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendAnalysis.slice(0, 10).map((trend, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border ${
                        trend.trend === "booming"
                          ? "bg-red-50 border-red-300"
                          : trend.trend === "growing"
                            ? "bg-yellow-50 border-yellow-300"
                            : "bg-green-50 border-green-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-950 mb-1">{trend.domain}</h3>
                          <p className="text-sm text-slate-600 mb-2">{trend.description}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                trend.trend === "booming"
                                  ? "bg-red-200 text-red-700"
                                  : trend.trend === "growing"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : "bg-green-200 text-green-700"
                              }`}
                            >
                              {trend.trend === "booming" && "🔥 Booming"}
                              {trend.trend === "growing" && "📈 Growing"}
                              {trend.trend === "stable" && "✅ Stable"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-slate-950">{trend.score}</div>
                          <div className="text-xs text-slate-500">Score</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-[var(--primary)] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
