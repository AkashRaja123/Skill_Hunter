"use client";

import { useState, useMemo } from "react";
import type { EnrichedCandidate } from "@/components/hr-dashboard-page";

interface Props {
  candidates: EnrichedCandidate[];
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onBulkStatusChange: (applicationIds: string[], newStatus: string) => void;
  onCandidateClick: (candidate: EnrichedCandidate) => void;
  onExportCSV: (candidates: EnrichedCandidate[]) => void;
}

const ALL_STATUSES = ["all", "applied", "screening", "interview", "offer", "accepted", "rejected", "declined"] as const;

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-amber-100 text-amber-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-emerald-100 text-emerald-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  declined: "bg-slate-200 text-slate-700",
};

type SortKey = "name" | "appliedRole" | "atsScore" | "status" | "appliedAt";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

export function HRCandidateTable({ candidates, onStatusChange, onBulkStatusChange, onCandidateClick, onExportCSV }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [atsMin, setAtsMin] = useState(0);
  const [atsMax, setAtsMax] = useState(100);
  const [sortKey, setSortKey] = useState<SortKey>("appliedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [bulkStatus, setBulkStatus] = useState("screening");

  // Unique roles
  const roles = useMemo(() => {
    const set = new Set(candidates.map((c) => c.appliedRole));
    return Array.from(set).sort();
  }, [candidates]);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Filter
  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (roleFilter !== "all" && c.appliedRole !== roleFilter) return false;
      if (c.atsScore < atsMin || c.atsScore > atsMax) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.appliedRole.toLowerCase().includes(q) ||
          c.topSkills.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [candidates, statusFilter, roleFilter, atsMin, atsMax, search]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "appliedRole": cmp = a.appliedRole.localeCompare(b.appliedRole); break;
        case "atsScore": cmp = a.atsScore - b.atsScore; break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "appliedAt": cmp = a.appliedAt.localeCompare(b.appliedAt); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((c) => c.applicationId)));
    }
  };

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return <span className="ml-1 text-slate-300">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const handleBulkAction = () => {
    if (selected.size === 0) return;
    onBulkStatusChange(Array.from(selected), bulkStatus);
    setSelected(new Set());
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === s
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--line)] bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold text-slate-500 uppercase">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
              className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[var(--primary)]"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold text-slate-500 uppercase">ATS Min</label>
            <input
              type="number"
              min={0}
              max={100}
              value={atsMin}
              onChange={(e) => { setAtsMin(Number(e.target.value)); setPage(0); }}
              className="w-16 rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold text-slate-500 uppercase">ATS Max</label>
            <input
              type="number"
              min={0}
              max={100}
              value={atsMax}
              onChange={(e) => { setAtsMax(Number(e.target.value)); setPage(0); }}
              className="w-16 rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-[var(--primary)]"
            />
          </div>

          <input
            type="text"
            placeholder="Search name, email, role, skills…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 sm:max-w-xs"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--primary)]/30 bg-blue-50 px-4 py-2.5">
          <span className="text-sm font-semibold text-slate-800">{selected.size} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[var(--primary)]"
          >
            {ALL_STATUSES.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={handleBulkAction}
            className="rounded-lg bg-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
          >
            Move
          </button>
          <button
            onClick={() => onExportCSV(candidates.filter((c) => selected.has(c.applicationId)))}
            className="rounded-lg border border-[var(--line)] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Export Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-slate-50">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={paged.length > 0 && selected.size === paged.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300"
                />
              </th>
              <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => handleSort("name")}>
                Candidate {sortArrow("name")}
              </th>
              <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => handleSort("appliedRole")}>
                Role {sortArrow("appliedRole")}
              </th>
              <th className="cursor-pointer px-4 py-3 text-center font-semibold text-slate-700" onClick={() => handleSort("atsScore")}>
                ATS {sortArrow("atsScore")}
              </th>
              <th className="cursor-pointer px-4 py-3 text-center font-semibold text-slate-700" onClick={() => handleSort("status")}>
                Status {sortArrow("status")}
              </th>
              <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => handleSort("appliedAt")}>
                Applied {sortArrow("appliedAt")}
              </th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  No candidates match the current filters.
                </td>
              </tr>
            ) : (
              paged.map((c) => (
                <tr
                  key={c.applicationId}
                  className="border-b border-[var(--line)] last:border-0 transition hover:bg-slate-50/60 cursor-pointer"
                  onClick={() => onCandidateClick(c)}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.applicationId)}
                      onChange={() => toggleSelect(c.applicationId)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.appliedRole}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex min-w-[2.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      c.atsScore >= 85 ? "bg-emerald-100 text-emerald-800"
                      : c.atsScore >= 70 ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                    }`}>
                      {c.atsScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[c.status] || statusColors.applied}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{new Date(c.appliedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => onStatusChange(c.applicationId, e.target.value)}
                      className="rounded-lg border border-[var(--line)] bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-[var(--primary)]"
                    >
                      {ALL_STATUSES.filter((s) => s !== "all").map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination + Export */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing {paged.length} of {sorted.length} candidates
          {filtered.length !== candidates.length && ` (filtered from ${candidates.length})`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCSV(sorted)}
            className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Export All CSV
          </button>
          {totalPages > 1 && (
            <>
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-xs text-slate-600">{page + 1} / {totalPages}</span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
