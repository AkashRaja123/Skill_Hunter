"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ParsedResumeData, AIAnalysis } from "@/lib/db/types";

// JobMatchingWizard triggers multi-step API calls (job search + ATS scoring).
// Lazy-load so its bundle is only fetched when the user opens the roles modal.
const JobMatchingWizard = dynamic(
  () => import("./job-matching-wizard").then((m) => ({ default: m.JobMatchingWizard })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading wizard…
      </div>
    ),
  }
);

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    parsedData: ParsedResumeData;
    aiAnalysis: AIAnalysis;
  } | null;
}

export function ResumePreviewModal({ isOpen, onClose, data }: ResumePreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const { parsedData, aiAnalysis } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Parsed Resume Results</h2>
            <p className="text-sm text-slate-500">AI Analysis & Extraction</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left Column: AI Analysis */}
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-blue-900">Overall Quality Score</h3>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {aiAnalysis.overallQuality}
                  </span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-blue-200">
                  <div 
                    className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${aiAnalysis.overallQuality}%` }}
                  />
                </div>
              </div>

              {/* Match Job Button */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-900">Job Matches</h3>
                <p className="mb-3 text-xs text-slate-500">Find roles that match your profile.</p>
                <button
                  onClick={() => setShowRolesModal(true)}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all active:scale-[0.98]"
                >
                  Match Job
                </button>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-emerald-900">Strengths</h3>
                  <ul className="space-y-1 text-xs text-emerald-800">
                    {aiAnalysis.strengthAreas.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-amber-900">Improvements</h3>
                  <ul className="space-y-1 text-xs text-amber-800">
                    {aiAnalysis.improvementAreas.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Parsed Data */}
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs">👤</span>
                  Personal Details
                </h3>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Name</dt>
                    <dd className="font-medium text-slate-900">{parsedData.personalInfo.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Email</dt>
                    <dd className="font-medium text-slate-900">{parsedData.personalInfo.email}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-slate-500">Phone</dt>
                      <dd className="font-medium text-slate-900">{parsedData.personalInfo.phone || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Location</dt>
                      <dd className="font-medium text-slate-900">{parsedData.personalInfo.location || "—"}</dd>
                    </div>
                  </div>
                  {(parsedData.personalInfo.linkedin || parsedData.personalInfo.portfolio) && (
                    <div className="flex gap-4 pt-2">
                      {parsedData.personalInfo.linkedin && (
                        <a href={parsedData.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">LinkedIn ↗</a>
                      )}
                      {parsedData.personalInfo.portfolio && (
                        <a href={parsedData.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Portfolio ↗</a>
                      )}
                    </div>
                  )}
                </dl>
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs">⚡</span>
                  Top Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.slice(0, 10).map((skill, i) => (
                    <span 
                      key={i} 
                      className={`rounded px-2 py-1 text-xs font-medium border ${
                        skill.proficiency === 'expert' 
                          ? 'bg-purple-50/50 text-purple-700 border-purple-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}
                    >
                      {skill.skillName}
                    </span>
                  ))}
                  {parsedData.skills.length > 10 && (
                    <span className="rounded px-2 py-1 text-xs text-slate-500">+{parsedData.skills.length - 10} more</span>
                  )}
                </div>
              </div>

              {/* Experience Preview */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs">💼</span>
                  Experience
                </h3>
                <div className="space-y-4">
                  {parsedData.experience.map((exp, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-slate-100 last:border-0">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300" />
                      <h4 className="text-sm font-medium text-slate-900">{exp.position}</h4>
                      <p className="text-xs text-slate-500">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                    </div>
                  ))}
                  {parsedData.experience.length === 0 && (
                    <p className="text-sm text-slate-400 italic">No experience found</p>
                  )}
                </div>
              </div>

            </div>
          </div>
          
          {/* Raw JSON Toggle (Optional for debugging) */}
          <div className="mt-8">
            <details className="group rounded-lg border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700">
                View Raw JSON Data
              </summary>
              <pre className="max-h-60 overflow-auto rounded-b-lg bg-slate-900 p-4 text-[10px] text-slate-300">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </details>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              // TODO: Implement navigation to full dashboard or job matching
              onClose();
            }}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>

      {/* Suggested Roles Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="border-b border-slate-100 bg-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Suggested Roles</h3>
              <button 
                onClick={() => setShowRolesModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="mb-4 text-sm text-slate-600">Select a role to check for job matches:</p>
              <div className="flex flex-col gap-2">
                {aiAnalysis.suggestedJobRoles.length > 0 ? (
                  aiAnalysis.suggestedJobRoles.map((role, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedRole(role)}
                      className={`relative flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                        selectedRole === role
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{role}</span>
                      {selectedRole === role && (
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No roles suggested.</p>
                )}
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-end gap-3">
               <button
                 onClick={() => setShowRolesModal(false)}
                 className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
               >
                 Cancel
               </button>
               <button
                 disabled={!selectedRole}
                 onClick={() => {
                   setShowRolesModal(false);
                   setShowWizard(true);
                 }}
                 className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20 transition-all active:scale-[0.98]"
               >
                 Proceed
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Matching Wizard */}
      {selectedRole && (
        <JobMatchingWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          selectedRole={selectedRole}
          parsedData={parsedData}
          aiAnalysis={aiAnalysis}
        />
      )}
    </div>
  );
}