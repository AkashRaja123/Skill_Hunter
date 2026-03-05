"use client";

import { useEffect, useState } from "react";
import type { NormalizedArticle, NewsCategory } from "@/lib/services/news-service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getImpactLabel(impact: NormalizedArticle["societalImpact"]): string {
  return impact === "growth" ? "Growth" : impact === "liability" ? "Liability" : "Mixed";
}

function getImpactClasses(impact: NormalizedArticle["societalImpact"]): string {
  if (impact === "growth") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (impact === "liability") return "bg-red-100 text-red-700 border border-red-200";
  return "bg-amber-100 text-amber-700 border border-amber-200";
}

function getDonutColor(impact: NormalizedArticle["societalImpact"]): string {
  if (impact === "growth") return "#059669";
  if (impact === "liability") return "#dc2626";
  return "#d97706";
}

function getDonutFill(score: number): number {
  const clamped = Math.max(-100, Math.min(100, score));
  return Math.round(((clamped + 100) / 200) * 100);
}

const CATEGORIES: NewsCategory[] = ["technology", "business", "career"];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  initialArticles: NormalizedArticle[];
  initialCategory: NewsCategory;
  initialError: string | null;
}

/**
 * Client component that handles interactive category switching.
 * On the initial render, it uses SSR-provided `initialArticles` so there is
 * no loading flash on first load.  Subsequent category switches trigger a
 * client-side fetch of /api/news.
 */
export function NewsContent({ initialArticles, initialCategory, initialError }: Props) {
  const [category, setCategory] = useState<NewsCategory>(initialCategory);
  const [articles, setArticles] = useState<NormalizedArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Skip the initial client fetch — data already came from SSR.
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/news?category=${category}&limit=12`);
        const json = (await res.json()) as {
          success: boolean;
          error?: string;
          data?: NormalizedArticle[];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <main className="container-shell py-10">
      {/* Header + category tabs */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Latest News</h1>
        <p className="mt-2 text-sm text-slate-600">
          Follow regular market, technology, and career news while you build your next move.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cat === category
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat[0].toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Loading skeleton */}
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

      {/* Error state */}
      {!loading && error && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      )}

      {/* Article grid */}
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
                        background: `conic-gradient(${getDonutColor(article.societalImpact)} ${getDonutFill(article.impactScore)}%, #e2e8f0 ${getDonutFill(article.impactScore)}% 100%)`,
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
  );
}
