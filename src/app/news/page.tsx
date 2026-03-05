"use client";

import { useEffect, useState } from "react";

import { SiteNavbar } from "@/components/site-navbar";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  author: string | null;
  societalImpact: "growth" | "liability" | "mixed";
  impactReason: string;
  impactScore: number;
}

type Category = "technology" | "business" | "career";

const categories: Category[] = ["technology", "business", "career"];

function getImpactLabel(impact: NewsArticle["societalImpact"]): string {
  return impact === "growth" ? "Growth" : impact === "liability" ? "Liability" : "Mixed";
}

function getImpactClasses(impact: NewsArticle["societalImpact"]): string {
  if (impact === "growth") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }
  if (impact === "liability") {
    return "bg-red-100 text-red-700 border border-red-200";
  }
  return "bg-amber-100 text-amber-700 border border-amber-200";
}

function getDonutColor(impact: NewsArticle["societalImpact"]): string {
  if (impact === "growth") return "#059669";
  if (impact === "liability") return "#dc2626";
  return "#d97706";
}

function getDonutFill(score: number): number {
  const clamped = Math.max(-100, Math.min(100, score));
  return Math.round(((clamped + 100) / 200) * 100);
}

export default function NewsPage() {
  const [category, setCategory] = useState<Category>("technology");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/news?category=${category}&limit=12`);
        const json = (await res.json()) as {
          success: boolean;
          error?: string;
          data?: NewsArticle[];
        };

        if (!json.success) {
          setError(json.error ?? "Unable to load news right now.");
          setArticles([]);
          return;
        }

        setArticles(json.data ?? []);
      } catch {
        setError("Unable to load news right now.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [category]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavbar />
      <main className="container-shell py-10">
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Latest News</h1>
          <p className="mt-2 text-sm text-slate-600">
            Follow regular market, technology, and career news while you build your next move.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 h-40 rounded-lg bg-slate-200" />
                <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mb-2 h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </section>
        )}

        {!loading && error && (
          <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </section>
        )}

        {!loading && !error && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-indigo-600">{article.source}</p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">{article.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{article.description}</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getImpactClasses(article.societalImpact)}`}
                      >
                        Society: {getImpactLabel(article.societalImpact)}
                      </span>
                      <div
                        className="relative h-12 w-12 rounded-full"
                        style={{
                          background: `conic-gradient(${getDonutColor(article.societalImpact)} ${getDonutFill(article.impactScore)}%, #e2e8f0 ${getDonutFill(article.impactScore)}% 100%)`
                        }}
                        aria-label={`Societal impact score ${article.impactScore}`}
                      >
                        <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-white text-[10px] font-semibold text-slate-700">
                          {article.impactScore > 0 ? `+${article.impactScore}` : article.impactScore}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{article.impactReason}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(article.publishedAt).toLocaleString()}</span>
                    {article.url !== "#" ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Read more
                      </a>
                    ) : (
                      <span className="font-semibold text-slate-400">Sample</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
