"use client";

import { useEffect, useState, useRef } from "react";
import type { EnrichedCandidate } from "@/components/hr-dashboard-page";

interface Props {
  candidate: EnrichedCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onNotesUpdate: (applicationId: string, notes: string) => void;
}

const ALL_STATUSES = ["applied", "screening", "interview", "offer", "accepted", "rejected", "declined"] as const;

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-amber-100 text-amber-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-emerald-100 text-emerald-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  declined: "bg-slate-200 text-slate-700",
};

/* ------------------------------------------------------------------ */
/*  ATS Score Ring (SVG)                                               */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#dc2626";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-700"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-slate-900 text-lg font-bold">
        {score}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Horizontal bar                                                     */
/* ------------------------------------------------------------------ */

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-slate-600">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Drawer Component                                                   */
/* ------------------------------------------------------------------ */

export function HRCandidateDrawer({ candidate, isOpen, onClose, onStatusChange, onNotesUpdate }: Props) {
  const [notes, setNotes] = useState("");
  const [notesChanged, setNotesChanged] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (candidate) {
      setNotes(candidate.notes || "");
      setNotesChanged(false);
    }
  }, [candidate]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const handleSaveNotes = () => {
    onNotesUpdate(candidate.applicationId, notes);
    setNotesChanged(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-[var(--line)] bg-white shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-[var(--line)] px-6 py-5">
          <ScoreRing score={candidate.atsScore} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-slate-900">{candidate.name}</h2>
            <p className="text-sm text-slate-500">{candidate.email}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{candidate.appliedRole}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[candidate.status] || statusColors.applied}`}>
                {candidate.status}
              </span>
              <span className="text-xs text-slate-400">Applied {new Date(candidate.appliedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status change */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">Change Status</label>
            <select
              value={candidate.status}
              onChange={(e) => onStatusChange(candidate.applicationId, e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-3 py-2 text-sm text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          {candidate.topSkills.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.topSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ATS Breakdown */}
          {candidate.scoreBreakdown && (
            <div>
              <h3 className="mb-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">ATS Breakdown</h3>
              <div className="space-y-2.5">
                <ScoreBar label="Keywords" value={candidate.scoreBreakdown.keywordMatch} />
                <ScoreBar label="Format" value={candidate.scoreBreakdown.formatCompliance} />
                <ScoreBar label="Experience" value={candidate.scoreBreakdown.experienceMatch} />
                <ScoreBar label="Skills" value={candidate.scoreBreakdown.skillsMatch} />
                <ScoreBar label="Education" value={candidate.scoreBreakdown.educationMatch} />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {candidate.suggestions && candidate.suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">ATS Suggestions</h3>
              <div className="space-y-2">
                {candidate.suggestions.map((s, i) => {
                  const priorityColor = s.priority === "high" ? "bg-red-100 text-red-700" : s.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
                  return (
                    <div key={i} className="rounded-lg border border-[var(--line)] bg-slate-50/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${priorityColor}`}>{s.priority}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{s.category}</span>
                      </div>
                      <p className="text-xs text-slate-700">{s.issue}</p>
                      <p className="mt-1 text-xs text-slate-500">{s.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Experience</h3>
              <div className="relative border-l-2 border-slate-200 pl-4 space-y-4">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--primary)] bg-white" />
                    <p className="text-sm font-semibold text-slate-800">{exp.position}</p>
                    <p className="text-xs text-slate-500">{exp.company} · {exp.startDate} – {exp.endDate}</p>
                    <p className="mt-1 text-xs text-slate-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Education</h3>
              <div className="space-y-2">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-[var(--line)] bg-white p-3">
                    <p className="text-sm font-semibold text-slate-800">{edu.degree} in {edu.field}</p>
                    <p className="text-xs text-slate-500">{edu.institution} · {edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Timeline */}
          {candidate.statusHistory && candidate.statusHistory.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Timeline</h3>
              <div className="relative border-l-2 border-slate-200 pl-4 space-y-3">
                {[...candidate.statusHistory].reverse().map((event, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColors[event.status] || statusColors.applied}`}>
                        {event.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{new Date(event.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {event.notes && <p className="mt-0.5 text-xs text-slate-500">{event.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Details */}
          {candidate.interviewDetails && candidate.interviewDetails.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Interviews</h3>
              <div className="space-y-2">
                {candidate.interviewDetails.map((interview, i) => (
                  <div key={i} className="rounded-lg border border-[var(--line)] bg-white p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800 capitalize">
                        Round {interview.round}: {interview.type}
                      </p>
                      {interview.completedAt && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">Completed</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Scheduled: {new Date(interview.scheduledAt).toLocaleDateString()}</p>
                    {interview.feedback && <p className="mt-1 text-xs text-slate-600 italic">"{interview.feedback}"</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesChanged(true); }}
              placeholder="Add notes about this candidate..."
              rows={3}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
            />
            {notesChanged && (
              <button
                onClick={handleSaveNotes}
                className="mt-2 rounded-lg bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
              >
                Save Notes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
