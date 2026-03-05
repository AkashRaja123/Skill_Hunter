import Link from "next/link";

const collections = [
  {
    name: "Users",
    path: "/users/{userId}",
    purpose: "Profile, metadata, and authentication-backed identity"
  },
  {
    name: "Resumes",
    path: "/users/{userId}/resumes/{resumeId}",
    purpose: "Parsed data + AI analysis only (no raw file storage)"
  },
  {
    name: "Job Matches",
    path: "/users/{userId}/jobMatches/{jobMatchId}",
    purpose: "Role details, matched skills, and fit scoring"
  },
  {
    name: "ATS Scores",
    path: "/users/{userId}/atsScores/{atsScoreId}",
    purpose: "Versioned scoring history and suggestions"
  },
  {
    name: "Resume Modifications",
    path: "/users/{userId}/resumeModifications/{modificationId}",
    purpose: "Tracked changes and optimization audit trail"
  },
  {
    name: "Applications",
    path: "/users/{userId}/applications/{applicationId}",
    purpose: "Application lifecycle and interview progression"
  }
];

const flow = [
  "Upload resume and parse into structured data.",
  "Analyze strengths and suggested roles.",
  "Fetch and score matched jobs.",
  "Calculate ATS score and generate suggestions.",
  "Iterate modifications until threshold is met.",
  "Track applications from applied to accepted/rejected."
];

export default function PlatformPage() {
  return (
    <main className="section-pad">
      <div className="container-shell">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">System Overview</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-slate-950">Skill Hunter Platform Blueprint</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              This page maps your design and flowchart documents into a production-oriented Next.js architecture with API routes,
              validated payloads, and a Firebase-ready data layer.
            </p>
          </div>
          <Link
            href="/"
            className="pill border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-900"
          >
            Back to Landing
          </Link>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="card p-6">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Application Flow</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              {flow.map((step, index) => (
                <li key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="mr-2 font-semibold text-[var(--primary)]">Step {index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </article>
          <article className="card p-6">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Backend Endpoints</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>
                <code>GET/POST /api/users</code>
              </p>
              <p>
                <code>GET/POST /api/resumes</code>
              </p>
              <p>
                <code>GET/POST /api/job-matches</code>
              </p>
              <p>
                <code>GET/POST /api/ats-scores</code>
              </p>
              <p>
                <code>GET/POST /api/resume-modifications</code>
              </p>
              <p>
                <code>GET/POST /api/applications</code>
              </p>
            </div>
            <p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              Set <code>USE_FIREBASE=true</code> and add Firebase environment variables when you are ready to switch data source.
            </p>
          </article>
        </section>

        <section className="mt-10 card overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-[0.9fr_1.3fr] md:divide-x md:divide-y-0">
            <div className="bg-slate-950 p-6 text-slate-100">
              <h2 className="font-heading text-2xl font-semibold">Collections</h2>
              <p className="mt-2 text-sm text-slate-300">Aligned with your design doc and ready for Firestore mapping.</p>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {collections.map((item) => (
                <div key={item.name} className="grid gap-2 p-4 md:grid-cols-[0.4fr_0.6fr]">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.path}</p>
                  </div>
                  <p className="text-sm text-slate-600">{item.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
