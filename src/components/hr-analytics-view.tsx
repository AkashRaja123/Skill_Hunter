"use client";

import { useMemo } from "react";
import type { EnrichedCandidate } from "@/components/hr-dashboard-page";

interface Props {
  candidates: EnrichedCandidate[];
}

const PIPELINE_STAGES = ["applied", "screening", "interview", "offer", "accepted"] as const;
const pipelineColors = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#16a34a"];

const statusColorsMap: Record<string, string> = {
  applied: "#3b82f6",
  screening: "#f59e0b",
  interview: "#8b5cf6",
  offer: "#10b981",
  accepted: "#16a34a",
  rejected: "#ef4444",
  declined: "#64748b",
};

const ATS_BINS = [
  { label: "0–59", min: 0, max: 59, color: "#ef4444" },
  { label: "60–69", min: 60, max: 69, color: "#f97316" },
  { label: "70–79", min: 70, max: 79, color: "#eab308" },
  { label: "80–89", min: 80, max: 89, color: "#22c55e" },
  { label: "90–100", min: 90, max: 100, color: "#059669" },
];

/* ------------------------------------------------------------------ */
/*  Pipeline Funnel (CSS)                                              */
/* ------------------------------------------------------------------ */

function PipelineFunnel({ candidates }: { candidates: EnrichedCandidate[] }) {
  const counts = PIPELINE_STAGES.map((s) => candidates.filter((c) => c.status === s).length);
  const maxCount = Math.max(...counts, 1);

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Pipeline Funnel</h3>
      <div className="space-y-2.5">
        {PIPELINE_STAGES.map((stage, i) => {
          const pct = (counts[i] / maxCount) * 100;
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium capitalize text-slate-600">{stage}</span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-slate-100">
                <div
                  className="absolute left-0 top-0 h-full rounded-lg transition-all duration-700"
                  style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: pipelineColors[i] }}
                />
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-white mix-blend-difference">
                  {counts[i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ATS Score Histogram (SVG)                                          */
/* ------------------------------------------------------------------ */

function ATSHistogram({ candidates }: { candidates: EnrichedCandidate[] }) {
  const binCounts = ATS_BINS.map((bin) =>
    candidates.filter((c) => c.atsScore >= bin.min && c.atsScore <= bin.max).length
  );
  const maxBin = Math.max(...binCounts, 1);
  const barWidth = 48;
  const gap = 16;
  const chartWidth = ATS_BINS.length * (barWidth + gap) - gap;
  const chartHeight = 120;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">ATS Score Distribution</h3>
      <svg viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 28}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {ATS_BINS.map((bin, i) => {
          const barH = (binCounts[i] / maxBin) * chartHeight;
          const x = i * (barWidth + gap) + 10;
          const y = chartHeight - barH;
          return (
            <g key={bin.label}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={6} fill={bin.color} className="transition-all duration-500" />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-slate-600 text-[10px] font-semibold">
                {binCounts[i] || ""}
              </text>
              <text x={x + barWidth / 2} y={chartHeight + 16} textAnchor="middle" className="fill-slate-500 text-[10px]">
                {bin.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Donut (CSS conic-gradient)                                  */
/* ------------------------------------------------------------------ */

function StatusDonut({ candidates }: { candidates: EnrichedCandidate[] }) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of candidates) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  }, [candidates]);

  const total = candidates.length || 1;
  const entries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

  // Build conic-gradient
  let accumulated = 0;
  const segments: string[] = [];
  for (const [status, count] of entries) {
    const pct = (count / total) * 100;
    const color = statusColorsMap[status] || "#94a3b8";
    segments.push(`${color} ${accumulated}% ${accumulated + pct}%`);
    accumulated += pct;
  }
  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Status Breakdown</h3>
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-28 w-28 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ background: gradient }}
          />
          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white">
            <span className="text-lg font-bold text-slate-800">{candidates.length}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5">
          {entries.map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: statusColorsMap[status] || "#94a3b8" }} />
              <span className="text-xs capitalize text-slate-600">{status}</span>
              <span className="text-xs font-semibold text-slate-800">{count}</span>
              <span className="text-[10px] text-slate-400">({Math.round((count / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Key Metrics                                                        */
/* ------------------------------------------------------------------ */

function KeyMetrics({ candidates }: { candidates: EnrichedCandidate[] }) {
  const avgAts = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + c.atsScore, 0) / candidates.length)
    : 0;

  const applied = candidates.filter((c) => ["applied", "screening", "interview", "offer", "accepted"].includes(c.status)).length;
  const offers = candidates.filter((c) => ["offer", "accepted"].includes(c.status)).length;
  const conversionRate = applied > 0 ? Math.round((offers / applied) * 100) : 0;

  // Top skills
  const skillMap: Record<string, number> = {};
  for (const c of candidates) {
    for (const skill of c.topSkills) {
      skillMap[skill] = (skillMap[skill] || 0) + 1;
    }
  }
  const topSkills = Object.entries(skillMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Recent (last 7 days)
  const weekAgo = Date.now() - 7 * 86_400_000;
  const thisWeek = candidates.filter((c) => new Date(c.appliedAt).getTime() >= weekAgo).length;

  const monthAgo = Date.now() - 30 * 86_400_000;
  const thisMonth = candidates.filter((c) => new Date(c.appliedAt).getTime() >= monthAgo).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card p-5 text-center">
        <p className="text-3xl font-bold text-[var(--primary)]">{avgAts}</p>
        <p className="mt-1 text-xs font-medium text-slate-600">Average ATS Score</p>
      </div>
      <div className="card p-5 text-center">
        <p className="text-3xl font-bold text-emerald-600">{conversionRate}%</p>
        <p className="mt-1 text-xs font-medium text-slate-600">Conversion Rate</p>
      </div>
      <div className="card p-5 text-center">
        <p className="text-3xl font-bold text-blue-600">{thisWeek}</p>
        <p className="mt-1 text-xs font-medium text-slate-600">This Week</p>
      </div>
      <div className="card p-5 text-center">
        <p className="text-3xl font-bold text-purple-600">{thisMonth}</p>
        <p className="mt-1 text-xs font-medium text-slate-600">This Month</p>
      </div>

      {/* Top skills */}
      {topSkills.length > 0 && (
        <div className="card col-span-full p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Top 5 Skills Across Candidates</h3>
          <div className="flex flex-wrap gap-2">
            {topSkills.map(([skill, count]) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                {skill} <span className="ml-1 text-blue-400">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Activity Feed                                               */
/* ------------------------------------------------------------------ */

function RecentActivity({ candidates }: { candidates: EnrichedCandidate[] }) {
  // Collect all status history events with candidate context
  const events = useMemo(() => {
    const all: { name: string; status: string; updatedAt: string; notes?: string }[] = [];
    for (const c of candidates) {
      for (const h of c.statusHistory || []) {
        all.push({ name: c.name, status: h.status, updatedAt: h.updatedAt, notes: h.notes });
      }
    }
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 10);
  }, [candidates]);

  if (events.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Recent Activity</h3>
      <div className="relative border-l-2 border-slate-200 pl-4 space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColorsMap[ev.status] || "#94a3b8" }} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">{ev.name}</span>
              <span className="text-[10px] text-slate-400">→</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize text-white" style={{ backgroundColor: statusColorsMap[ev.status] || "#94a3b8" }}>
                {ev.status}
              </span>
              <span className="text-[10px] text-slate-400">{new Date(ev.updatedAt).toLocaleDateString()}</span>
            </div>
            {ev.notes && <p className="mt-0.5 text-xs text-slate-500">{ev.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Analytics View                                                */
/* ------------------------------------------------------------------ */

export function HRAnalyticsView({ candidates }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <PipelineFunnel candidates={candidates} />
        <ATSHistogram candidates={candidates} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusDonut candidates={candidates} />
        <KeyMetrics candidates={candidates} />
      </div>

      <RecentActivity candidates={candidates} />
    </div>
  );
}
