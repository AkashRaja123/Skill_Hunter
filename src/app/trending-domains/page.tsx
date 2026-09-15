"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

interface DomainTrendScore {
  domain: string;
  score: number;
  trend: "booming" | "growing" | "stable";
  description: string;
}

interface JobRole {
  domain: string;
  score: number;
  roles: string[];
}

interface Insight {
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
  category: string;
}

interface TrendingDomainsData {
  domains: DomainTrendScore[];
  categories: {
    booming: string[];
    growing: string[];
    stable: string[];
  };
  totalDomains: number;
  sampledArticles: number;
  topBoomingDomain?: DomainTrendScore | null;
  boomingDomains?: DomainTrendScore[];
}

interface TrendingJobsData {
  jobsByDomain: JobRole[];
  totalDomains: number;
  totalJobRoles: number;
  sampledArticles: number;
}

interface MarketInsightsData {
  summary: string;
  insights: Insight[];
  jobOpportunities: string[];
  skillsToLearn: string[];
  warnings: string[];
  boomingDomains: DomainTrendScore[];
  sampledArticles: number;
}

export default function TrendingDomainsPage() {
  const [domainsData, setDomainsData] = useState<TrendingDomainsData | null>(null);
  const [jobsData, setJobsData] = useState<TrendingJobsData | null>(null);
  const [insightsData, setInsightsData] = useState<MarketInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "insights">("overview");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [domainsRes, jobsRes, insightsRes] = await Promise.all([
          fetch("/api/trending-domains"),
          fetch("/api/trending-jobs"),
          fetch("/api/market-insights")
        ]);

        let hasCriticalError = false;
        let criticalErrorMsg = "";

        if (!domainsRes.ok) {
          hasCriticalError = true;
          const data = await domainsRes.json().catch(() => ({}));
          criticalErrorMsg = data.error || `Failed to fetch domains: ${domainsRes.status}`;
        }

        if (domainsRes.ok) {
          const data = await domainsRes.json();
          if (data.success || data.data) {
            setDomainsData(data.data || data);
          } else if (!hasCriticalError) {
            hasCriticalError = true;
            criticalErrorMsg = data.error || "Invalid response format";
          }
        }

        if (jobsRes.ok) {
          const data = await jobsRes.json();
          if (data.success || data.data) {
            setJobsData(data.data || data);
          }
        }

        if (insightsRes.ok) {
          const data = await insightsRes.json();
          if (data.success || data.data) {
            setInsightsData(data.data || data);
          }
        }

        if (hasCriticalError) {
          setError(criticalErrorMsg);
        }
      } catch (err) {
        console.error("Error fetching trending data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch trending data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "booming":
        return "text-red-600 bg-red-50";
      case "growing":
        return "text-yellow-600 bg-yellow-50";
      case "stable":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "booming":
        return "🔥 Booming";
      case "growing":
        return "📈 Growing";
      case "stable":
        return "✅ Stable";
      default:
        return "Status Unknown";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SiteNavbar />

      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚀 Trending Tech Domains</h1>
          <p className="text-slate-300 max-w-2xl">
            Real-time analysis of technology trends, emerging job opportunities, and market insights
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-slate-300 mt-4">Analyzing tech trends...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-300">
            <h3 className="font-semibold mb-2">⚠️ Error Loading Data</h3>
            <p>{error}</p>
            <p className="text-sm mt-2 text-red-400">
              Make sure NEWSAPI_KEY is configured in your .env.local file
            </p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-slate-700">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "jobs"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                💼 Job Opportunities
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "insights"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                🔍 Insights
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && domainsData && (
              <div className="space-y-6">
                {/* Top Booming Domain Hero */}
                {(() => {
                  const topFromApi = domainsData.topBoomingDomain;
                  const computedTop =
                    domainsData.domains.find((d) => d.trend === "booming") || null;
                  const topDomain = topFromApi ?? computedTop;

                  if (!topDomain) return null;

                  return (
                    <div className="bg-gradient-to-r from-red-600/80 via-orange-500/80 to-yellow-400/80 rounded-2xl p-6 md:p-8 shadow-xl border border-red-400/60">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                            Today&apos;s Top Booming Domain
                          </p>
                          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
                            {topDomain.domain}
                          </h2>
                          <p className="mt-2 text-sm md:text-base text-white/90 max-w-xl">
                            {topDomain.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-sm">
                              {topDomain.score}
                            </span>
                            <span className="text-sm md:text-base font-semibold text-white/90">
                              Boom Score
                            </span>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                            🔥 Highest momentum domain today
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-slate-400 text-sm font-medium">Total Domains</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {domainsData.totalDomains}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-slate-400 text-sm font-medium">Booming Domains</div>
                    <div className="text-3xl font-bold text-red-400 mt-2">
                      {domainsData.categories.booming.length}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-slate-400 text-sm font-medium">News Articles Analyzed</div>
                    <div className="text-3xl font-bold text-blue-400 mt-2">
                      {domainsData.sampledArticles}
                    </div>
                  </div>
                </div>

                {/* Booming Domains */}
                {domainsData.categories.booming.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🔥 Booming Domains</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domainsData.domains
                        .filter((d) => d.trend === "booming")
                        .map((domain) => (
                          <div
                            key={domain.domain}
                            className="bg-red-900/20 border border-red-700/50 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{domain.domain}</h3>
                                <p className="text-sm text-slate-300 mt-1">{domain.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-red-400">{domain.score}</div>
                                <div className="text-xs text-red-300">Boom Score</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Growing Domains */}
                {domainsData.categories.growing.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">📈 Growing Domains</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domainsData.domains
                        .filter((d) => d.trend === "growing")
                        .map((domain) => (
                          <div
                            key={domain.domain}
                            className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{domain.domain}</h3>
                                <p className="text-sm text-slate-300 mt-1">{domain.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-yellow-400">{domain.score}</div>
                                <div className="text-xs text-yellow-300">Boom Score</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Stable Domains */}
                {domainsData.categories.stable.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">✅ Stable Domains</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domainsData.domains
                        .filter((d) => d.trend === "stable")
                        .slice(0, 4)
                        .map((domain) => (
                          <div
                            key={domain.domain}
                            className="bg-green-900/20 border border-green-700/50 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{domain.domain}</h3>
                                <p className="text-sm text-slate-300 mt-1">{domain.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">{domain.score}</div>
                                <div className="text-xs text-green-300">Boom Score</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && jobsData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-slate-400 text-sm font-medium">Total Job Roles</div>
                    <div className="text-3xl font-bold text-green-400 mt-2">
                      {jobsData.totalJobRoles}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-slate-400 text-sm font-medium">Trending Domains</div>
                    <div className="text-3xl font-bold text-blue-400 mt-2">
                      {jobsData.totalDomains}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {jobsData.jobsByDomain.map((job) => (
                    <div
                      key={job.domain}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{job.domain}</h3>
                          <div className="mt-1 inline-block px-3 py-1 bg-blue-900/50 rounded text-blue-300 text-sm">
                            🎯 Demand Score: {job.score}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.roles.map((role) => (
                          <span
                            key={role}
                            className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded-full text-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === "insights" && insightsData && (
              <div className="space-y-6">
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Market Summary</h2>
                  <p className="text-slate-300">{insightsData.summary}</p>
                </div>

                {insightsData.insights.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Key Insights</h2>
                    <div className="space-y-3">
                      {insightsData.insights.map((insight, idx) => (
                        <div key={idx} className={`rounded-lg p-4 ${getImportanceColor(insight.importance)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{insight.title}</h3>
                              <p className="text-sm text-slate-300 mt-2">{insight.description}</p>
                              <div className="mt-2 inline-block text-xs font-medium px-2 py-1 bg-black/30 rounded">
                                {insight.category}
                              </div>
                            </div>
                            <span className="text-sm font-medium ml-4">
                              {insight.importance === "high" && "🔴 HIGH"}
                              {insight.importance === "medium" && "🟡 MED"}
                              {insight.importance === "low" && "🟢 LOW"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {insightsData.jobOpportunities.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white mb-4">💼 In-Demand Job Roles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {insightsData.jobOpportunities.map((opp, idx) => (
                        <div key={idx} className="flex items-center text-slate-300">
                          <span className="text-green-400 mr-2">✓</span>
                          {opp}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {insightsData.skillsToLearn.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white mb-4">📚 Skills to Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {insightsData.skillsToLearn.map((skill, idx) => (
                        <div key={idx} className="flex items-center text-slate-300">
                          <span className="text-blue-400 mr-2">→</span>
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {insightsData.warnings.length > 0 && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white mb-4">⚠️ Warnings</h2>
                    <ul className="space-y-2">
                      {insightsData.warnings.map((warning, idx) => (
                        <li key={idx} className="text-red-300 flex items-start">
                          <span className="mr-2">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
