import Link from "next/link";

const logos = ["PixelFrame", "StackLabs", "CloudNest", "Northway", "LoopGrid", "SprintOS"];

const testimonials = [
  {
    quote:
      "We cut resume review time by 62% and finally have a reliable way to coach candidates toward ATS-ready applications.",
    name: "Maya Ofori",
    title: "Head of Talent, CloudNest"
  },
  {
    quote:
      "Skill Hunter showed us exactly where every resume was weak, then helped us fix it in one workflow.",
    name: "Daniel Voss",
    title: "Career Services Director, Northway"
  }
];

const benefits = [
  {
    icon: "01",
    title: "Know Your Match Before You Apply",
    body: "Instantly compare parsed resume data against job requirements so candidates only pursue roles with real fit."
  },
  {
    icon: "02",
    title: "Raise ATS Scores Faster",
    body: "Built-in scoring and targeted suggestions help teams improve resumes in fewer iterations."
  },
  {
    icon: "03",
    title: "Track Every Improvement",
    body: "Versioned score history and modification logs show exactly what changed and why outcomes improved."
  },
  {
    icon: "04",
    title: "Turn Feedback Into Action",
    body: "Recommendations are grouped by impact, giving users a clear sequence from issue to fix to higher score."
  },
  {
    icon: "05",
    title: "Operate With One Workflow",
    body: "From parsing to applications, everything stays connected so teams avoid fragmented tools."
  },
  {
    icon: "06",
    title: "Built for Scale",
    body: "Production-ready API and pluggable storage let you start quickly and switch to Firebase without rewriting core logic."
  }
];

const faqs = [
  {
    q: "Is this right for me?",
    a: "Yes, if you are a job seeker, placement team, or training program that needs stronger ATS-ready resumes and clear job-fit scoring."
  },
  {
    q: "How long does setup take?",
    a: "Most teams can run the app locally in minutes. Firebase can be connected later by filling environment variables."
  },
  {
    q: "Do I need technical experience?",
    a: "No for daily usage. For deployment, a developer can follow the included environment and API structure."
  },
  {
    q: "What if scores do not improve?",
    a: "You still get detailed diagnostics and version history to identify blockers, then iterate with targeted changes."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are placeholders and can be adapted to your billing model with no lock-in assumptions."
  }
];

export function LandingPage() {
  return (
    <>
      <section className="section-pad pb-16 pt-10">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Built For Conversion
            </p>
            <h1 className="fade-up fade-delay-1 mt-4 font-heading text-4xl font-extrabold leading-tight text-slate-950 md:text-5xl lg:text-6xl">
              Achieve Better Job Outcomes Without Guessing What ATS Systems Want
            </h1>
            <p className="fade-up fade-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Skill Hunter helps job seekers and talent teams parse resumes, match real opportunities, and improve ATS score
              with clear, practical guidance.
            </p>
            <div className="fade-up fade-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="pill bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                Try It Free
              </Link>
              <Link
                href="/platform"
                className="pill border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
              >
                Explore Product Page
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Brand colors: [Primary Color], [Accent Color] | Font style: Modern | Button shape: Pill
            </p>
          </div>
          <div className="card gradient-ring grid-overlay min-h-[360px] overflow-hidden p-6">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-white/90 p-6">
              <p className="text-sm font-semibold text-slate-500">Product Demo Placeholder (2-3 min)</p>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-50">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Live ATS Console</p>
                <div className="mt-4 space-y-3">
                  <div className="h-2 w-10/12 rounded bg-slate-600" />
                  <div className="h-2 w-8/12 rounded bg-slate-700" />
                  <div className="h-2 w-9/12 rounded bg-emerald-400/80" />
                  <div className="h-2 w-7/12 rounded bg-slate-700" />
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-600">Replace with a real product mockup or embedded demo video.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-slate-100 bg-white/60">
        <div className="container-shell">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trusted by teams at</p>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo) => (
              <div key={logo} className="card flex h-16 items-center justify-center text-sm font-semibold text-slate-500">
                {logo}
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {testimonials.map((item) => (
              <article key={item.name} className="card p-6">
                <p className="text-sm leading-relaxed text-slate-700">"{item.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.title}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section-pad">
        <div className="container-shell">
          <h2 className="font-heading text-3xl font-bold text-slate-950 md:text-4xl">There&apos;s a Better Way</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="card bg-slate-900 p-7 text-slate-100">
              <h3 className="font-heading text-2xl font-semibold">Old Way</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li>Manual review with inconsistent feedback.</li>
                <li>Applying blindly without understanding role fit.</li>
                <li>No reliable record of what improved ATS outcomes.</li>
              </ul>
            </article>
            <article className="card border-emerald-100 bg-emerald-50 p-7">
              <h3 className="font-heading text-2xl font-semibold text-slate-950">New Way With Skill Hunter</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                <li>Structured parsed data across skills, projects, and experience.</li>
                <li>Job matching and scoring driven by real requirement overlap.</li>
                <li>Versioned ATS improvements with clear next actions.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--section)]">
        <div className="container-shell">
          <h2 className="font-heading text-3xl font-bold text-slate-950 md:text-4xl">Why You&apos;ll Love Skill Hunter</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <article key={item.title} className="card p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="pill bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Start Improving Resumes
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-pad">
        <div className="container-shell">
          <h2 className="font-heading text-3xl font-bold text-slate-950 md:text-4xl">How It Works</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Step 1</p>
              <h3 className="mt-3 font-heading text-xl font-semibold">Upload and Parse</h3>
              <p className="mt-2 text-sm text-slate-600">Capture resume content as structured data with AI-powered extraction.</p>
            </article>
            <article className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Step 2</p>
              <h3 className="mt-3 font-heading text-xl font-semibold">Match and Optimize</h3>
              <p className="mt-2 text-sm text-slate-600">Compare against jobs, score ATS fit, and apply targeted improvements.</p>
            </article>
            <article className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Step 3</p>
              <h3 className="mt-3 font-heading text-xl font-semibold">Apply With Confidence</h3>
              <p className="mt-2 text-sm text-slate-600">Track applications and status updates with full score history context.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/80">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card min-h-[320px] overflow-hidden p-6">
            <p className="text-sm font-semibold text-slate-700">Visual Demo Placeholder</p>
            <div className="mt-5 h-[250px] rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-700" />
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold text-slate-950">See The Workflow In Action</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>What it does: Turns resume text into structured, searchable data and scoring signals.</li>
              <li>Who it helps: Job seekers, talent teams, and career programs.</li>
              <li>What makes it different: Combines matching, ATS scoring, and iteration tracking in one system.</li>
            </ul>
            <Link
              href="/platform"
              className="pill inline-flex bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              View Architecture Page
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-pad">
        <div className="container-shell">
          <h2 className="text-center font-heading text-3xl font-bold text-slate-950 md:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-2 text-center text-sm text-slate-500">[Insert Your Pricing Here]</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="card p-6">
              <h3 className="font-heading text-xl font-semibold">Basic</h3>
              <p className="mt-3 text-3xl font-bold">$29</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Parsed resume storage</li>
                <li>10 ATS score reports</li>
                <li>Job match feed</li>
                <li>Email support</li>
              </ul>
              <Link href="#final-cta" className="pill mt-6 inline-flex border border-slate-300 px-5 py-2.5 text-sm font-semibold">
                Choose Basic
              </Link>
            </article>
            <article className="card relative border-2 border-[var(--primary)] bg-blue-50 p-6">
              <span className="pill absolute -top-3 left-6 bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">Most Popular</span>
              <h3 className="font-heading text-xl font-semibold">Pro</h3>
              <p className="mt-3 text-3xl font-bold">$79</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Unlimited ATS reports</li>
                <li>Versioned optimization history</li>
                <li>Priority matching updates</li>
                <li>Team collaboration</li>
                <li>Advanced analytics</li>
              </ul>
              <Link
                href="#final-cta"
                className="pill mt-6 inline-flex bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
              >
                Choose Pro
              </Link>
            </article>
            <article className="card p-6">
              <h3 className="font-heading text-xl font-semibold">Enterprise</h3>
              <p className="mt-3 text-3xl font-bold">Custom</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Custom role matching rules</li>
                <li>SLA + dedicated onboarding</li>
                <li>Workflow automations</li>
                <li>Admin audit controls</li>
              </ul>
              <Link href="#contact" className="pill mt-6 inline-flex border border-slate-300 px-5 py-2.5 text-sm font-semibold">
                Contact Sales
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="section-pad bg-[var(--section)]">
        <div className="container-shell max-w-4xl">
          <h2 className="text-center font-heading text-3xl font-bold text-slate-950 md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="card p-5" open={item.q === faqs[0].q}>
                <summary className="cursor-pointer list-none font-semibold text-slate-900">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="pill bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <section id="final-cta" className="section-pad bg-slate-950 text-slate-50">
        <div className="container-shell text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Ready to Land Better-Fit Opportunities?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
            Launch your ATS optimization workflow now and start turning every resume revision into measurable progress.
          </p>
          <Link
            href="/dashboard"
            className="pill mt-8 inline-flex bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Join Now
          </Link>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white py-8">
        <div className="container-shell flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-slate-900">[Your Logo Here]</p>
          <p>Copyright 2026 Skill Hunter. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Social Links</Link>
            <Link href="mailto:hello@skillhunter.app">hello@skillhunter.app</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
