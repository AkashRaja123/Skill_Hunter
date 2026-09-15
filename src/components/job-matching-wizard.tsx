"use client";

import { useEffect, useState, useCallback } from "react";
import type { ParsedResumeData, AIAnalysis, JobSearchResult, ATSAnalysisResult } from "@/lib/db/types";

interface JobMatchingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: string;
  parsedData: ParsedResumeData;
  aiAnalysis: AIAnalysis;
  resumeId?: string;
  userId?: string;
}

type WizardStep = "jobs" | "ats-result";
type ActiveTab = "enhancer" | "skills-gap";

export function JobMatchingWizard({
  isOpen,
  onClose,
  selectedRole,
  parsedData,
  resumeId,
  userId
}: JobMatchingWizardProps) {
  const [step, setStep] = useState<WizardStep>("jobs");
  const [jobs, setJobs] = useState<JobSearchResult[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobSearchResult | null>(null);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);
  const [loadingAts, setLoadingAts] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("enhancer");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedScore, setEnhancedScore] = useState<number | null>(null);
  const [enhancementStatus, setEnhancementStatus] = useState<string | null>(null);
  const [enhancedParsedData, setEnhancedParsedData] = useState<ParsedResumeData | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    setJobsError(null);
    try {
      const res = await fetch("/api/predict-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });
      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
      } else {
        setJobsError(json.error ?? "Failed to fetch jobs");
      }
    } catch {
      setJobsError("Network error while fetching jobs");
    } finally {
      setLoadingJobs(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (isOpen) {
      setStep("jobs");
      setSelectedJob(null);
      setAtsResult(null);
      setEnhancedScore(null);
      setActiveTab("enhancer");
      setEnhancementStatus(null);
      setEnhancedParsedData(null);
      fetchJobs();
    }
  }, [isOpen, fetchJobs]);

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

  if (!isOpen) return null;

  const handleAnalyzeMatch = async () => {
    if (!selectedJob) return;
    setLoadingAts(true);
    try {
      const res = await fetch("/api/ats-scores/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsedData,
          jobTitle: selectedJob.title,
          jobDescription: selectedJob.description,
          resumeId,
          userId
        })
      });
      const json = await res.json();
      if (json.success) {
        setAtsResult(json.data);
        setStep("ats-result");
      }
    } catch {
      // stay on jobs step
    } finally {
      setLoadingAts(false);
    }
  };

  const handleAutoEnhance = async () => {
    if (!atsResult || !selectedJob) return;

    setIsEnhancing(true);
    setEnhancementStatus(null);

    try {
      // Add missing ATS keywords once (dedupe by skill name)
      const existing = new Set(parsedData.skills.map((s) => s.skillName.toLowerCase()));
      const addedSkills = atsResult.resumeEnhancement.keywordsToAdd
        .filter((kw) => !existing.has(kw.toLowerCase()))
        .map((kw) => ({
          skillName: kw,
          category: "technical" as const,
          proficiency: "intermediate" as const
        }));

      const enhanced = {
        ...parsedData,
        skills: [...parsedData.skills, ...addedSkills]
      };

      setEnhancedParsedData(enhanced);

      // Recalculate ATS on enhanced data
      const res = await fetch("/api/ats-scores/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsedData: enhanced,
          jobTitle: selectedJob.title,
          jobDescription: selectedJob.description,
          resumeId,
          userId
        })
      });
      const json = await res.json();

      if (json.success) {
        setEnhancedScore(json.data.score);
        setEnhancementStatus("Resume enhanced successfully! You can now download it.");
      } else {
        setEnhancementStatus("Enhancement complete, but ATS re-analysis failed.");
      }
    } catch {
      setEnhancementStatus("Failed to enhance resume. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownloadResume = () => {
    if (!enhancedParsedData || !selectedJob || !atsResult) return;

    const name = enhancedParsedData.personalInfo.name || "Candidate";
    const lines: string[] = [];

    // Header with name
    lines.push("<div align='center'>\n");
    lines.push(`# ${name}\n`);
    lines.push("---\n");
    
    // Contact info with icons
    const contacts = [];
    if (enhancedParsedData.personalInfo.email) {
      contacts.push(`📧 ${enhancedParsedData.personalInfo.email}`);
    }
    if (enhancedParsedData.personalInfo.phone) {
      contacts.push(`📱 ${enhancedParsedData.personalInfo.phone}`);
    }
    if (enhancedParsedData.personalInfo.location) {
      contacts.push(`📍 ${enhancedParsedData.personalInfo.location}`);
    }
    if (contacts.length > 0) {
      lines.push(contacts.join(" • ") + "\n");
    }
    lines.push("\n</div>\n");

    // Target Role Badge
    lines.push("## 🎯 Target Role\n");
    lines.push(`> **${selectedJob.title}** at **${selectedJob.company}**\n`);
    lines.push("");

    // Professional Summary
    if (atsResult.resumeEnhancement.phrasesToUse.length > 0) {
      lines.push("## 💼 Professional Summary\n");
      lines.push(atsResult.resumeEnhancement.phrasesToUse.join(". ") + ".\n");
      lines.push("");
    }

    // Skills with badges
    lines.push("## 🚀 Skills\n");
    const skillsByCategory = enhancedParsedData.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof enhancedParsedData.skills>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`);
      skills.forEach(skill => {
        const badge = skill.proficiency === "expert" ? "🌟" : skill.proficiency === "intermediate" ? "⭐" : "✨";
        lines.push(`- ${badge} **${skill.skillName}** _(${skill.proficiency})_`);
      });
      lines.push("");
    });

    // Experience
    if (enhancedParsedData.experience.length > 0) {
      lines.push("## 💡 Experience\n");
      enhancedParsedData.experience.forEach((exp) => {
        lines.push(`### ${exp.position}\n`);
        lines.push(`**${exp.company}** | _${exp.startDate} - ${exp.endDate}_\n`);
        if (exp.description) {
          lines.push(`${exp.description}\n`);
        }
        if (exp.achievements.length > 0) {
          lines.push("**Key Achievements:**");
          exp.achievements.forEach((achievement) => {
            lines.push(`- ✓ ${achievement}`);
          });
        }
        lines.push("");
      });
    }

    // Education
    if (enhancedParsedData.education.length > 0) {
      lines.push("## 🎓 Education\n");
      enhancedParsedData.education.forEach((edu) => {
        lines.push(`### ${edu.degree} in ${edu.field}\n`);
        lines.push(`**${edu.institution}** | _Graduated: ${edu.graduationDate}_\n`);
      });
      lines.push("");
    }

    // ATS Optimizations
    if (atsResult.resumeEnhancement.sectionsToUpdate.length > 0) {
      lines.push("## 🎨 ATS-Optimized Enhancements\n");
      lines.push("> This resume has been optimized based on ATS analysis\n");
      atsResult.resumeEnhancement.sectionsToUpdate.forEach((section) => {
        lines.push(`- 🔹 ${section}`);
      });
      lines.push("");
    }

    // Footer
    lines.push("---\n");
    lines.push("<div align='center'>\n");
    lines.push(`_ATS Score: **${enhancedScore || atsResult.score}/100**_ | _Generated on ${new Date().toLocaleDateString()}_\n`);
    lines.push("</div>");

    const markdown = lines.join("\n");
    const safeName =
      (name || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
      "resume";
    const fileName = `${safeName}-enhanced-resume.md`;

    // Download
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scoreColor = (score: number) =>
    score >= 85 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600";
  const scoreBg = (score: number) =>
    score >= 85 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  const scoreRing = (score: number) =>
    score >= 85 ? "ring-emerald-500" : score >= 60 ? "ring-amber-500" : "ring-red-500";

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          {step === "ats-result" && (
            <button
              onClick={() => { setStep("jobs"); setAtsResult(null); setEnhancedScore(null); }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {step === "jobs" ? "Related Jobs" : "ATS Analysis"}
            </h2>
            <p className="text-sm text-slate-500">Role: {selectedRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-4 flex items-center gap-2 text-xs text-slate-400">
            <span className={`rounded-full px-2.5 py-0.5 font-medium ${step === "jobs" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>1. Jobs</span>
            <span className="text-slate-300">&rarr;</span>
            <span className={`rounded-full px-2.5 py-0.5 font-medium ${step === "ats-result" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>2. ATS Score</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {/* ============ STEP: JOBS ============ */}
        {step === "jobs" && (
          <div className="mx-auto max-w-4xl p-6">
            {loadingJobs ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mb-2 h-3 w-1/2 rounded bg-slate-200" />
                    <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
                    <div className="h-12 w-full rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : jobsError ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-red-700">{jobsError}</p>
                <button onClick={fetchJobs} className="mt-3 text-sm text-red-600 underline hover:text-red-800">Retry</button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">No jobs found for &quot;{selectedRole}&quot;.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`rounded-xl border p-5 text-left transition-all hover:shadow-md ${
                      selectedJob?.id === job.id
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{job.title}</h3>
                    <p className="mt-1 text-sm font-medium text-indigo-600">{job.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      {job.jobType && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">{job.jobType}</span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                          {job.salaryMin && job.salaryMax
                            ? `₹${(job.salaryMin / 1000).toFixed(0)}k - ₹${(job.salaryMax / 1000).toFixed(0)}k`
                            : job.salaryMin
                            ? `From ₹${(job.salaryMin / 1000).toFixed(0)}k`
                            : `Up to ₹${(job.salaryMax! / 1000).toFixed(0)}k`}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-500 line-clamp-3">{job.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ STEP: ATS RESULT ============ */}
        {step === "ats-result" && atsResult && (
          <div className="mx-auto max-w-3xl p-6">
            {/* Score Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
              <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full ring-4 ${scoreRing(atsResult.score)} bg-white`}>
                <span className={`text-4xl font-bold ${scoreColor(atsResult.score)}`}>{atsResult.score}</span>
              </div>
              <h3 className={`mt-4 text-lg font-bold ${scoreColor(atsResult.score)}`}>
                {atsResult.passedThreshold ? "Strong Match!" : "Needs Improvement"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {atsResult.passedThreshold
                  ? "Your resume is well-aligned with this position."
                  : `Score is below the 85 threshold for "${selectedJob?.title}".`}
              </p>

              {enhancedScore !== null && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Enhanced Score: {enhancedScore} (+{enhancedScore - atsResult.score})
                </div>
              )}

              {/* Score Breakdown */}
              <div className="mt-6 grid gap-2 text-left text-xs">
                {[
                  { label: "Keyword Match", value: atsResult.scoreBreakdown.keywordMatch },
                  { label: "Experience", value: atsResult.scoreBreakdown.experienceMatch },
                  { label: "Skills", value: atsResult.scoreBreakdown.skillsMatch },
                  { label: "Format", value: atsResult.scoreBreakdown.formatCompliance },
                  { label: "Education", value: atsResult.scoreBreakdown.educationMatch }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-24 text-slate-500">{item.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${scoreBg(item.value)} transition-all duration-500`} style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Passed: action buttons */}
            {atsResult.passedThreshold && (
              <div className="mt-6 flex justify-center gap-3">
                {selectedJob?.jobUrl && (
                  <a
                    href={selectedJob.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    Apply Now ↗
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Save &amp; Close
                </button>
              </div>
            )}

            {/* Failed: Resume Enhancer & Skills Gap tabs */}
            {!atsResult.passedThreshold && (
              <div className="mt-6">
                {/* Tab buttons */}
                <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setActiveTab("enhancer")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === "enhancer" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Resume Enhancer
                  </button>
                  <button
                    onClick={() => setActiveTab("skills-gap")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === "skills-gap" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Skills Gap
                  </button>
                </div>

                {/* Enhancer Tab */}
                {activeTab === "enhancer" && (
                  <div className="mt-4 space-y-4">
                    {/* Keywords to Add */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <h4 className="text-sm font-semibold text-slate-900">Keywords to Add</h4>
                      <p className="mb-3 text-xs text-slate-500">Add these keywords to your resume to improve ATS compatibility.</p>
                      <div className="flex flex-wrap gap-2">
                        {atsResult.resumeEnhancement.keywordsToAdd.map((kw, i) => (
                          <span key={i} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                            {kw}
                          </span>
                        ))}
                        {atsResult.resumeEnhancement.keywordsToAdd.length === 0 && (
                          <span className="text-xs text-slate-400 italic">No keywords suggested.</span>
                        )}
                      </div>
                    </div>

                    {/* Phrases to Use */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <h4 className="text-sm font-semibold text-slate-900">Phrases to Use</h4>
                      <p className="mb-3 text-xs text-slate-500">Incorporate these action phrases into your resume sections.</p>
                      <div className="space-y-2">
                        {atsResult.resumeEnhancement.phrasesToUse.map((phrase, i) => (
                          <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-700 font-mono">
                            &ldquo;{phrase}&rdquo;
                          </div>
                        ))}
                        {atsResult.resumeEnhancement.phrasesToUse.length === 0 && (
                          <span className="text-xs text-slate-400 italic">No phrases suggested.</span>
                        )}
                      </div>
                    </div>

                    {/* Sections to Update */}
                    {atsResult.resumeEnhancement.sectionsToUpdate.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h4 className="text-sm font-semibold text-slate-900">Sections to Update</h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                          {atsResult.resumeEnhancement.sectionsToUpdate.map((sec, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-0.5 text-indigo-500">&rarr;</span>
                              <span>{sec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Auto-Enhance CTA */}
                    {enhancedScore === null ? (
                      <button
                        onClick={handleAutoEnhance}
                        disabled={isEnhancing}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                      >
                        {isEnhancing ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Enhancing...
                          </span>
                        ) : (
                          "Auto-Enhance My Resume"
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-lg border-2 border-emerald-100 bg-emerald-50/50 px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 text-emerald-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold">Resume Enhanced Successfully!</span>
                          </div>
                        </div>
                        <button
                          onClick={handleDownloadResume}
                          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Stylish Resume (Markdown)
                        </button>
                      </div>
                    )}
                    {enhancementStatus && (
                      <p
                        className={`text-center text-xs font-medium ${
                          enhancementStatus.toLowerCase().includes("failed") ? "text-red-600" : "text-emerald-700"
                        }`}
                      >
                        {enhancementStatus}
                      </p>
                    )}
                  </div>
                )}

                {/* Skills Gap Tab */}
                {activeTab === "skills-gap" && (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <h4 className="text-sm font-semibold text-slate-900">Missing Skills</h4>
                      <p className="mb-3 text-xs text-slate-500">Skills required by this job that you should develop.</p>
                      {atsResult.skillsGap.missingSkills.length > 0 ? (
                        <div className="space-y-2">
                          {atsResult.skillsGap.missingSkills.map((ms, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5">
                              <span className="text-sm font-medium text-slate-800">{ms.skill}</span>
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                ms.importance === "critical"
                                  ? "bg-red-100 text-red-700"
                                  : ms.importance === "recommended"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {ms.importance}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No missing skills identified.</p>
                      )}
                    </div>

                    {atsResult.skillsGap.timeToLearn && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                        <h4 className="text-sm font-semibold text-blue-900">Estimated Learning Time</h4>
                        <p className="mt-1 text-sm text-blue-800">{atsResult.skillsGap.timeToLearn}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Apply Anyway link */}
                {selectedJob?.jobUrl && (
                  <div className="mt-4 text-center">
                    <a
                      href={selectedJob.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 underline hover:text-slate-600"
                    >
                      Apply Anyway &rarr;
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer (jobs step only) */}
      {step === "jobs" && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 flex justify-between items-center">
          <p className="text-xs text-slate-400">
            {jobs.length > 0 ? `${jobs.length} jobs found` : ""}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={!selectedJob || loadingAts}
              onClick={handleAnalyzeMatch}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20 transition-all"
            >
              {loadingAts ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Match →"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
