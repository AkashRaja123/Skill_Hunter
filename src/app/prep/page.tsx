"use client";

import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { PrepInterface } from "@/prep";
import { useAuth } from "@/context/auth-context";

export default function PrepPage() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteNavbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[var(--primary)]"></div>
            <p className="text-sm text-slate-600">Loading Prep Hub...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user && role === "hr_recruiter") {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteNavbar />
        <main className="section-pad">
          <div className="container-shell max-w-2xl text-center">
            <div className="card p-8 shadow-sm">
              <div className="text-5xl">🎯</div>
              <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900">
                Job Seeker Prep Hub
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                The Skill Hunter Prep Hub is designed for job candidates to practice aptitude, verbal reasoning, and coding problems. As an HR & Recruiter account, you have access to candidate analytics and recruitment pipeline tools.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="pill bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
                >
                  Go to HR Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavbar />
      <PrepInterface />
    </div>
  );
}
