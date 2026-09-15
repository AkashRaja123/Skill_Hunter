import { HRDashboardSkeleton, DashboardSkeleton } from "@/components/loading-skeletons";

/**
 * Shown by Next.js while the dashboard server segment is being prepared.
 * We can't know the role here, so we show the simpler seeker skeleton —
 * client-side the correct dashboard replaces it immediately after hydration.
 */
export default function DashboardLoading() {
  return (
    <>
      <DashboardSkeleton />
      {/* Pre-render the HR skeleton off-screen so its chunk is already in cache */}
      <div className="hidden" aria-hidden>
        <HRDashboardSkeleton />
      </div>
    </>
  );
}
