"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { DashboardSkeleton, HRDashboardSkeleton } from "@/components/loading-skeletons";

// Lazy-load heavy dashboard bundles — each is only fetched when the user lands
// on the dashboard with the matching role, keeping the initial JS payload small.
const DashboardPage = dynamic(
  () => import("@/components/dashboard-page").then((m) => ({ default: m.DashboardPage })),
  { ssr: false, loading: () => <DashboardSkeleton /> }
);

const HRDashboardPage = dynamic(
  () => import("@/components/hr-dashboard-page").then((m) => ({ default: m.HRDashboardPage })),
  { ssr: false, loading: () => <HRDashboardSkeleton /> }
);

export default function Dashboard() {
  const { role, loading } = useAuth();

  // While Firebase resolves the session, show the appropriate skeleton.
  if (loading) {
    return role === "hr_recruiter" ? <HRDashboardSkeleton /> : <DashboardSkeleton />;
  }

  if (role === "hr_recruiter") {
    return <HRDashboardPage />;
  }

  return <DashboardPage />;
}
