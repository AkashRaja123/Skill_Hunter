"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteNavbar } from "@/components/site-navbar";

interface CandidateEntry {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  atsScore: number;
  status: "new" | "screening" | "interview" | "offer" | "rejected";
  appliedAt: string;
}

const statusColors: Record<CandidateEntry["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  screening: "bg-amber-100 text-amber-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const demoCandidates: CandidateEntry[] = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", appliedRole: "Frontend Developer", atsScore: 87, status: "screening", appliedAt: "2026-03-01" },
  { id: "2", name: "Sara Chen", email: "sara@example.com", appliedRole: "Data Engineer", atsScore: 72, status: "new", appliedAt: "2026-03-03" },
  { id: "3", name: "Marcus Lee", email: "marcus@example.com", appliedRole: "Frontend Developer", atsScore: 93, status: "interview", appliedAt: "2026-02-28" },
  { id: "4", name: "Priya Sharma", email: "priya@example.com", appliedRole: "UX Designer", atsScore: 65, status: "rejected", appliedAt: "2026-02-25" },
  { id: "5", name: "James Wright", email: "james@example.com", appliedRole: "Backend Developer", atsScore: 81, status: "offer", appliedAt: "2026-02-20" },
];

export function HRDashboardPage() {
  const [filter, setFilter] = useState<CandidateEntry["status"] | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = demoCandidates.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: demoCandidates.length,
    newCount: demoCandidates.filter((c) => c.status === "new").length,
    inPipeline: demoCandidates.filter((c) => ["screening", "interview"].includes(c.status)).length,
    avgAts: Math.round(demoCandidates.reduce((s, c) => s + c.atsScore, 0) / demoCandidates.length),
  };

  return (
    <main>
      <SiteNavbar />

      <section className="section-pad bg-gradient-to-b from-purple-50/50 to-transparent">
        <div className="container-shell">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline">
              ← Back to Home
            </Link>

            <h1 className="mt-6 font-heading text-4xl font-bold text-slate-950 md:text-5xl">
              Recruiter Dashboard
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Review candidates, track ATS scores, and manage your hiring pipeline in one place.
            </p>
          </div>

          {/* Stats cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">{stats.total}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Total Candidates</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">New Applications</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.inPipeline}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">In Pipeline</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.avgAts}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Avg ATS Score</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["all", "new", "screening", "interview", "offer", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                    filter === s
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--line)] bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search candidates or roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 sm:max-w-xs"
            />
          </div>

          {/* Candidates table */}
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] bg-slate-50">
                  <th className="px-5 py-3 text-left font-semibold text-slate-700">Candidate</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-700">Applied Role</th>
                  <th className="px-5 py-3 text-center font-semibold text-slate-700">ATS Score</th>
                  <th className="px-5 py-3 text-center font-semibold text-slate-700">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-700">Applied</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      No candidates match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-[var(--line)] last:border-0 hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{c.appliedRole}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex min-w-[3rem] items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
                          c.atsScore >= 85 ? "bg-emerald-100 text-emerald-800" :
                          c.atsScore >= 70 ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {c.atsScore}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{c.appliedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick actions */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <h3 className="font-heading text-base font-semibold text-slate-900">Post a Job</h3>
              <p className="mt-1 text-xs text-slate-600">Create a new job listing for candidates to match against.</p>
              <button type="button" className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">
                Create Listing
              </button>
            </div>
            <div className="card p-5">
              <h3 className="font-heading text-base font-semibold text-slate-900">Bulk ATS Review</h3>
              <p className="mt-1 text-xs text-slate-600">Run ATS scoring across multiple candidate resumes at once.</p>
              <button type="button" className="mt-4 rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                Start Review
              </button>
            </div>
            <div className="card p-5">
              <h3 className="font-heading text-base font-semibold text-slate-900">Export Report</h3>
              <p className="mt-1 text-xs text-slate-600">Download a summary of your pipeline and candidate metrics.</p>
              <button type="button" className="mt-4 rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
