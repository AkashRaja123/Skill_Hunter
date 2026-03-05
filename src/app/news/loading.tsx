/**
 * Shown by Next.js (via Suspense streaming) while the news page performs
 * its server-side ISR fetch.  Mirrors the skeleton in NewsContent.
 */
export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar placeholder */}
      <div className="h-20 animate-pulse bg-white shadow-sm" />

      <main className="container-shell py-10">
        {/* Header card skeleton */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 flex gap-2">
            {["w-24", "w-20", "w-20"].map((w, i) => (
              <div key={i} className={`h-9 ${w} animate-pulse rounded-full bg-slate-200`} />
            ))}
          </div>
        </section>

        {/* Article card skeletons */}
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
      </main>
    </div>
  );
}
