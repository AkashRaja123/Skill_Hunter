"use client";

import { useAuth } from "@/context/auth-context";
import { DashboardPage } from "@/components/dashboard-page";
import { HRDashboardPage } from "@/components/hr-dashboard-page";

export default function Dashboard() {
  const { role } = useAuth();

  if (role === "hr_recruiter") {
    return <HRDashboardPage />;
  }

  return <DashboardPage />;
}
