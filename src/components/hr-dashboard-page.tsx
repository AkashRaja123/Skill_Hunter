"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import { SiteNavbar } from "@/components/site-navbar";
import { HRPipelineBoard } from "@/components/hr-pipeline-board";
import { HRCandidateDrawer } from "@/components/hr-candidate-drawer";
import { HRCandidateTable } from "@/components/hr-candidate-table";
import { HRAnalyticsView } from "@/components/hr-analytics-view";
import type {
  Application,
  ApplicationStatusEvent,
  ATSScore,
  ATSSuggestion,
  InterviewDetail,
  Resume,
  ResumeEducation,
  ResumeExperience,
  User,
} from "@/lib/db/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EnrichedCandidate {
  applicationId: string;
  userId: string;
  name: string;
  email: string;
  appliedRole: string;
  atsScore: number;
  status: string;
  appliedAt: string;
  topSkills: string[];
  scoreBreakdown: ATSScore["scoreBreakdown"] | null;
  suggestions: ATSSuggestion[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  statusHistory: ApplicationStatusEvent[];
  interviewDetails: InterviewDetail[];
  notes?: string;
}

type Tab = "overview" | "pipeline" | "candidates" | "analytics";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

/* ------------------------------------------------------------------ */
/*  CSV export helper                                                  */
/* ------------------------------------------------------------------ */

function exportCSV(candidates: EnrichedCandidate[]) {
  const headers = ["Name", "Email", "Applied Role", "ATS Score", "Status", "Applied Date", "Top Skills"];
  const rows = candidates.map((c) => [
    c.name,
    c.email,
    c.appliedRole,
    String(c.atsScore),
    c.status,
    new Date(c.appliedAt).toLocaleDateString(),
    c.topSkills.join("; "),
  ]);

  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `candidates-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Toast Component                                                    */
/* ------------------------------------------------------------------ */

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-right duration-300 ${
            t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          <span>{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="ml-2 text-white/70 hover:text-white">×</button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Components                                                */
/* ------------------------------------------------------------------ */

function SkeletonCard() {
  return <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />;
}

function SkeletonStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function HRDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // Raw data from APIs
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [atsScores, setAtsScores] = useState<ATSScore[]>([]);

  // Drawer state
  const [drawerCandidate, setDrawerCandidate] = useState<EnrichedCandidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ---- Toast helper ---- */
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---- Data fetching ---- */
  const fetchData = useCallback(async () => {
    try {
      const [appsRes, usersRes, resumesRes, atsRes] = await Promise.all([
        fetch("/api/applications"),
        fetch("/api/users"),
        fetch("/api/resumes"),
        fetch("/api/ats-scores"),
      ]);

      const [appsJson, usersJson, resumesJson, atsJson] = await Promise.all([
        appsRes.json(),
        usersRes.json(),
        resumesRes.json(),
        atsRes.json(),
      ]);

      if (appsJson.success) setApplications(appsJson.data);
      if (usersJson.success) setUsers(usersJson.data);
      if (resumesJson.success) setResumes(resumesJson.data);
      if (atsJson.success) setAtsScores(atsJson.data);

      setError(null);
    } catch {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* ---- Enrich candidates (join data) ---- */
  const enrichedCandidates: EnrichedCandidate[] = useMemo(() => {
    return applications.map((app) => {
      const user = users.find((u) => u.userId === app.userId);
      const resume = resumes.find((r) => r.resumeId === app.resumeId);
      const ats = atsScores.find((a) => a.resumeId === app.resumeId && a.jobMatchId === app.jobMatchId);

      return {
        applicationId: app.applicationId,
        userId: app.userId,
        name: user?.displayName || resume?.parsedData?.personalInfo?.name || "Unknown",
        email: user?.email || resume?.parsedData?.personalInfo?.email || "",
        appliedRole: "Candidate", // derived from jobMatch if available
        atsScore: ats?.score ?? app.finalATSScore,
        status: app.applicationStatus,
        appliedAt: app.appliedAt,
        topSkills: resume?.parsedData?.skills?.map((s) => s.skillName).slice(0, 8) || [],
        scoreBreakdown: ats?.scoreBreakdown || null,
        suggestions: ats?.suggestions || [],
        experience: resume?.parsedData?.experience || [],
        education: resume?.parsedData?.education || [],
        statusHistory: app.statusHistory,
        interviewDetails: app.interviewDetails,
        notes: app.notes,
      };
    });
  }, [applications, users, resumes, atsScores]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const total = enrichedCandidates.length;
    const newCount = enrichedCandidates.filter((c) => c.status === "applied").length;
    const inPipeline = enrichedCandidates.filter((c) => ["screening", "interview"].includes(c.status)).length;
    const avgAts = total > 0 ? Math.round(enrichedCandidates.reduce((s, c) => s + c.atsScore, 0) / total) : 0;
    const offers = enrichedCandidates.filter((c) => ["offer", "accepted"].includes(c.status)).length;
    const accepted = enrichedCandidates.filter((c) => c.status === "accepted").length;
    const acceptRate = offers > 0 ? Math.round((accepted / offers) * 100) : 0;
    return { total, newCount, inPipeline, avgAts, offers, acceptRate };
  }, [enrichedCandidates]);

  /* ---- Status change (single) ---- */
  const handleStatusChange = useCallback(async (applicationId: string, newStatus: string) => {
    // Optimistic update
    setApplications((prev) =>
      prev.map((a) =>
        a.applicationId === applicationId
          ? {
              ...a,
              applicationStatus: newStatus as Application["applicationStatus"],
              statusHistory: [
                ...a.statusHistory,
                { status: newStatus as Application["applicationStatus"], updatedAt: new Date().toISOString() },
              ],
            }
          : a
      )
    );

    // Also update drawer if current candidate
    if (drawerCandidate?.applicationId === applicationId) {
      setDrawerCandidate((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusHistory: [
                ...prev.statusHistory,
                { status: newStatus as Application["applicationStatus"], updatedAt: new Date().toISOString() },
              ],
            }
          : prev
      );
    }

    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, applicationStatus: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      addToast(`Moved to ${newStatus}`, "success");
    } catch {
      addToast("Failed to update status", "error");
      fetchData(); // rollback
    }
  }, [addToast, fetchData, drawerCandidate]);

  /* ---- Bulk status change ---- */
  const handleBulkStatusChange = useCallback(async (applicationIds: string[], newStatus: string) => {
    // Optimistic
    setApplications((prev) =>
      prev.map((a) =>
        applicationIds.includes(a.applicationId)
          ? {
              ...a,
              applicationStatus: newStatus as Application["applicationStatus"],
              statusHistory: [
                ...a.statusHistory,
                { status: newStatus as Application["applicationStatus"], updatedAt: new Date().toISOString() },
              ],
            }
          : a
      )
    );

    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds, applicationStatus: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      addToast(`Moved ${applicationIds.length} candidates to ${newStatus}`, "success");
    } catch {
      addToast("Bulk update failed", "error");
      fetchData();
    }
  }, [addToast, fetchData]);

  /* ---- Notes update ---- */
  const handleNotesUpdate = useCallback(async (applicationId: string, notes: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, notes }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setApplications((prev) =>
        prev.map((a) => (a.applicationId === applicationId ? { ...a, notes } : a))
      );
      addToast("Notes saved", "success");
    } catch {
      addToast("Failed to save notes", "error");
    }
  }, [addToast]);

  /* ---- Drawer handlers ---- */
  const openDrawer = useCallback((c: EnrichedCandidate) => {
    setDrawerCandidate(c);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  /* ---- Tabs ---- */
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline" },
    { id: "candidates", label: "Candidates" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <main>
      <SiteNavbar />

      {/* Hero */}
      <section className="section-pad bg-gradient-to-b from-purple-50/50 to-transparent">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline">
                ← Back to Home
              </Link>
              <h1 className="mt-3 font-heading text-3xl font-bold text-slate-950 md:text-4xl">
                Recruiter Command Center
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Track candidates, manage pipeline, and optimize your hiring process.
              </p>
            </div>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="shrink-0 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="mt-6"><SkeletonStats /></div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">{stats.total}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">Total Candidates</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">New Applications</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.inPipeline}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">In Pipeline</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.avgAts}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">Avg ATS Score</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.offers}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">Offers Extended</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.acceptRate}%</p>
                <p className="mt-1 text-xs font-medium text-slate-600">Accept Rate</p>
              </div>
            </div>
          )}

          {/* Tab bar */}
          <div className="mt-6 flex gap-1 rounded-xl border border-[var(--line)] bg-white p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-shell">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between">
              <p className="text-sm text-red-800">{error}</p>
              <button onClick={fetchData} className="text-sm font-semibold text-red-800 underline">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : enrichedCandidates.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold text-slate-900">No candidates yet</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                When job seekers submit applications through the platform, they&apos;ll appear here.
                You can also add candidates manually by creating applications via the API.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={fetchData} className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                  Refresh Data
                </button>
                <Link href="/" className="rounded-xl border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Go Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Overview — Pipeline board + Candidates table preview */}
              {tab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-4 font-heading text-lg font-semibold text-slate-900">Pipeline Overview</h2>
                    <HRPipelineBoard
                      candidates={enrichedCandidates}
                      onStatusChange={handleStatusChange}
                      onCandidateClick={openDrawer}
                    />
                  </div>
                  <div>
                    <h2 className="mb-4 font-heading text-lg font-semibold text-slate-900">Recent Candidates</h2>
                    <HRCandidateTable
                      candidates={enrichedCandidates}
                      onStatusChange={handleStatusChange}
                      onBulkStatusChange={handleBulkStatusChange}
                      onCandidateClick={openDrawer}
                      onExportCSV={exportCSV}
                    />
                  </div>
                </div>
              )}

              {/* Pipeline — Full Kanban board */}
              {tab === "pipeline" && (
                <HRPipelineBoard
                  candidates={enrichedCandidates}
                  onStatusChange={handleStatusChange}
                  onCandidateClick={openDrawer}
                />
              )}

              {/* Candidates — Full table */}
              {tab === "candidates" && (
                <HRCandidateTable
                  candidates={enrichedCandidates}
                  onStatusChange={handleStatusChange}
                  onBulkStatusChange={handleBulkStatusChange}
                  onCandidateClick={openDrawer}
                  onExportCSV={exportCSV}
                />
              )}

              {/* Analytics */}
              {tab === "analytics" && (
                <HRAnalyticsView candidates={enrichedCandidates} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Drawer */}
      <HRCandidateDrawer
        candidate={drawerCandidate}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onStatusChange={handleStatusChange}
        onNotesUpdate={handleNotesUpdate}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
