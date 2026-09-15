"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

interface TopIndustry {
  industry: string;
  improvementScore: number;
  keyKeywords: string[];
  dailyOutlook: string;
  relevantArticles: any[];
}

interface DailyReport {
  report: {
    topIndustries: TopIndustry[];
    overallTechMomentum: "positive" | "neutral" | "negative";
    summary: string;
    fetchedAt: string;
  };
  forecast: string;
  timestamp: string;
}

export default function TechDashboard() {
  const [data, setData] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cacheExpires, setCacheExpires] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tech-news/daily");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch data");
        }
        
        setData(result.data);
        setIsCached(result.cached);
        setCacheExpires(result.cacheExpiresAt);
        setTimeRemaining(result.timeRemaining);
      } catch (err) {
        console.error("Error fetching daily report:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyReport();

    // Optionally refresh UI every minute to update time remaining counter
    const interval = setInterval(() => {
      setCounter((c) => c + 1);
      // Refetch to get updated time remaining
      fetchDailyReport();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-32">
            <div className="space-y-4 text-center">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-300 text-lg">Loading today's tech insights...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <main className="container mx-auto px-4 py-12">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-300 mb-4">⚠️ Error Loading Tech Data</h2>
            <p className="text-red-200 mb-4 text-lg">{error || "Failed to load data"}</p>
            <div className="bg-red-900/20 border border-red-700 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-300 mb-2">How to Fix:</h3>
              <ul className="list-disc list-inside text-red-200 space-y-2">
                <li>
                  Make sure you have a valid{" "}
                  <code className="bg-slate-900 px-2 py-1 rounded">NEWSAPI_KEY</code> in your{" "}
                  <code className="bg-slate-900 px-2 py-1 rounded">.env.local</code> file
                </li>
                <li>
                  Get a free API key from{" "}
                  <a href="https://newsapi.org/" target="_blank" className="underline">
                    newsapi.org
                  </a>
                </li>
                <li>Restart the development server after adding the API key</li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const topIndustry = data.report.topIndustries[0];
  const otherIndustries = data.report.topIndustries.slice(1, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SiteNavbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-2">
            🚀 Most Improving Technology
          </h1>
          <p className="text-xl text-slate-300">
            Daily tech insights refreshed once every 24 hours
          </p>
        </div>

        {/* Cache Status Banner */}
        <div className={`mb-8 p-6 rounded-lg border ${
          isCached
            ? "bg-orange-500/10 border-orange-500"
            : "bg-green-500/10 border-green-500"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold mb-1 text-slate-200">
                {isCached ? "📦 Using Cached Data" : "🆕 Fresh Data"}
              </p>
              <p className="text-slate-300">
                {isCached
                  ? "Showing cached data from previous fetch"
                  : "Latest data fetched and cached for 24 hours"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400 mb-1">
                {timeRemaining}
              </p>
              <p className="text-xs text-slate-400">
                Next refresh: {new Date(cacheExpires).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Hero - Most Improving Technology */}
        {topIndustry && (
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-green-600/20 border border-blue-500/30 p-12 shadow-2xl">
              {/* Background accent */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

              <div className="relative z-10">
                {/* Industry Name */}
                <div className="mb-8">
                  <p className="text-blue-300 text-lg font-semibold mb-2">
                    🏆 TODAY'S TOP INDUSTRY
                  </p>
                  <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                    {topIndustry.industry}
                  </h2>
                </div>

                {/* Score Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {/* Main Score */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                    <p className="text-slate-300 text-sm font-semibold mb-3">
                      Improvement Score
                    </p>
                    <div className="text-center">
                      <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {topIndustry.improvementScore}%
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 mt-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                          style={{ width: `${topIndustry.improvementScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Momentum */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                    <p className="text-slate-300 text-sm font-semibold mb-3">
                      Market Momentum
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full animate-pulse ${
                          data.report.overallTechMomentum === "positive"
                            ? "bg-green-500"
                            : data.report.overallTechMomentum === "neutral"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <p className="text-2xl font-bold text-white">
                        {data.report.overallTechMomentum === "positive"
                          ? "📈 Rising"
                          : data.report.overallTechMomentum === "neutral"
                            ? "➡️ Stable"
                            : "📉 Declining"}
                      </p>
                    </div>
                  </div>

                  {/* Article Count */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                    <p className="text-slate-300 text-sm font-semibold mb-3">
                      News Coverage
                    </p>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-300 mb-2">
                        {topIndustry.relevantArticles.length}
                      </p>
                      <p className="text-slate-300 text-sm">Articles Found</p>
                    </div>
                  </div>
                </div>

                {/* Daily Outlook */}
                <div className="mb-8 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                  <p className="text-slate-300 text-sm font-semibold mb-3">
                    Daily Outlook
                  </p>
                  <p className="text-xl text-slate-100 leading-relaxed">
                    {topIndustry.dailyOutlook}
                  </p>
                </div>

                {/* Key Technologies */}
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-4">
                    Key Technologies & Keywords
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {topIndustry.keyKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-6 py-2 bg-blue-600/40 text-blue-200 rounded-full text-sm font-semibold border border-blue-400/30 hover:bg-blue-600/60 transition-colors"
                      >
                        ⚡ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Watch List - Other Improving Industries */}
        {otherIndustries.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-white mb-6">
              👀 Also Improving Today
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherIndustries.map((industry, index) => (
                <div
                  key={industry.industry}
                  className="bg-slate-700/40 backdrop-blur rounded-xl p-6 border border-slate-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">
                      #{index + 2}. {industry.industry}
                    </h4>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">Score</span>
                      <span className="text-xl font-bold text-green-400">
                        {industry.improvementScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full"
                        style={{ width: `${industry.improvementScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-xs font-semibold mb-2">
                      KEY AREAS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industry.keyKeywords.slice(0, 2).map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 bg-slate-600/60 text-slate-200 rounded text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {industry.dailyOutlook.slice(0, 120)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Section */}
        <div className="mb-12">
          <div className="bg-slate-700/40 backdrop-blur rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">
              📊 Today's Tech Landscape
            </h3>
            <p className="text-lg text-slate-100 leading-relaxed">
              {data.report.summary}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-700/40 backdrop-blur rounded-xl p-8 border border-slate-600 mb-12">
          <h3 className="text-xl font-bold text-white mb-4">ℹ️ About This Dashboard</h3>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">✓</span>
              <span>
                <strong>24-Hour Cache:</strong> Data fetches once and caches for 24 hours to avoid
                redundant API calls
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">✓</span>
              <span>
                <strong>Automatic Refresh:</strong> Cache expires after 24 hours and fresh data is fetched
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">✓</span>
              <span>
                <strong>Real-time Updates:</strong> Uses NewsAPI for latest tech news and industry
                trends
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">✓</span>
              <span>
                <strong>Improvement Scores:</strong> Based on news article frequency and relevant keywords
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/tech-news"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View All Industries
          </Link>
          <Link
            href="/dashboard"
            className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Back to Resume Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
