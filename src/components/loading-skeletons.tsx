/**
 * Skeleton placeholders used as Suspense and lazy-loading fallbacks.
 * All components are purely presentational (no "use client" needed).
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

function SkeletonBar({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className ?? ""}`} />;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className ?? ""}`} />;
}

// ─── Page-level skeletons ─────────────────────────────────────────────────────

/** Used while the job-seeker DashboardPage lazy chunk is loading. */
export function DashboardSkeleton() {
  return (
    <main>
      {/* Navbar placeholder */}
      <div className="h-20 animate-pulse bg-slate-100" />

      {/* Hero */}
      <section className="section-pad bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="container-shell max-w-2xl space-y-4">
          <SkeletonBar className="h-4 w-32" />
          <SkeletonBar className="mt-4 h-10 w-3/4" />
          <SkeletonBar className="h-5 w-full" />
          <SkeletonBar className="h-5 w-5/6" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SkeletonBlock className="h-24" />
            <SkeletonBlock className="h-24" />
            <SkeletonBlock className="h-24" />
          </div>
        </div>
      </section>

      {/* Upload zone */}
      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          <SkeletonBlock className="h-48 w-full" />
        </div>
      </section>
    </main>
  );
}

/** Used while the HR HRDashboardPage lazy chunk is loading. */
export function HRDashboardSkeleton() {
  return (
    <main>
      {/* Navbar placeholder */}
      <div className="h-20 animate-pulse bg-slate-100" />

      {/* Hero + stats */}
      <section className="section-pad bg-gradient-to-b from-purple-50/50 to-transparent">
        <div className="container-shell space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonBar className="h-4 w-32" />
              <SkeletonBar className="h-9 w-64" />
              <SkeletonBar className="h-4 w-80" />
            </div>
            <SkeletonBlock className="h-10 w-28" />
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-20" />
            ))}
          </div>

          {/* Tab bar */}
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </section>

      {/* Content cards */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-24" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/** Inline spinner used inside tab panels while a lazy component loads. */
export function TabPanelSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-24" />
      ))}
    </div>
  );
}

/** Used while a modal lazy-chunk loads (ResumePreviewModal, JobMatchingWizard). */
export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <SkeletonBar className="mb-4 h-6 w-48" />
        <SkeletonBar className="mb-2 h-4 w-full" />
        <SkeletonBar className="mb-2 h-4 w-5/6" />
        <SkeletonBar className="mb-6 h-4 w-2/3" />
        <SkeletonBlock className="h-40 w-full" />
      </div>
    </div>
  );
}
