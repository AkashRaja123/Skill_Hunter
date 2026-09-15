"use client";

import Link from "next/link";
import { useState } from "react";
import { AptitudeQuiz } from "./aptitude-quiz";
import { VerbalQuiz } from "./verbal-quiz";
import CodingRoadmap from "./coding-roadmap";

export interface PrepCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PREP_CATEGORIES: PrepCategory[] = [
  {
    id: "aptitude",
    name: "Aptitude",
    description: "Improve your logical reasoning and problem-solving skills",
    icon: "🧠"
  },
  {
    id: "verbal",
    name: "Verbal",
    description: "Enhance your communication and language skills",
    icon: "📝"
  },
  {
    id: "coding",
    name: "Coding",
    description: "Master coding problems, technical concepts, and practice coding challenges & algorithms",
    icon: "💻"
  }
];

export function PrepInterface() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory === "aptitude") {
    return <AptitudeQuiz onBack={() => setSelectedCategory(null)} />;
  }

  if (selectedCategory === "verbal") {
    return <VerbalQuiz onBack={() => setSelectedCategory(null)} />;
  }

  if (selectedCategory === "coding") {
    return (
      <div style={{ background: "#0f1117", minHeight: "100vh" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e2433" }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{ color: "#4f6ef7", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            ← Back
          </button>
        </div>
        <CodingRoadmap />
      </div>
    );
  }

  return (
    <main>
      <section className="section-pad bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="container-shell">
          <div className="max-w-3xl">
            <Link href="/dashboard" className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline">
              ← Back to Dashboard
            </Link>

            <h1 className="mt-6 font-heading text-4xl font-bold text-slate-950 md:text-5xl">
              Skill Prep & Training
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Prepare yourself with focused training modules. Choose a category and start improving your skills today.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          {/* Aptitude and Verbal - 2 columns */}
          <div className="grid gap-6 md:grid-cols-2 md:max-w-2xl md:mx-auto mb-6">
            {PREP_CATEGORIES.slice(0, 2).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="card p-8 text-left transition hover:shadow-lg hover:border-[var(--primary)]"
              >
                <div className="mb-4 text-5xl">{category.icon}</div>
                <h3 className="font-heading text-xl font-bold text-slate-950">
                  {category.name}
                </h3>
                <p className="mt-2 text-slate-600">
                  {category.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                  Start Now
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Coding - Centered below */}
          <div className="max-w-2xl mx-auto">
            {PREP_CATEGORIES.slice(2).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="card p-8 text-left transition hover:shadow-lg hover:border-[var(--primary)] w-full"
              >
                <div className="mb-4 text-5xl">{category.icon}</div>
                <h3 className="font-heading text-xl font-bold text-slate-950">
                  {category.name}
                </h3>
                <p className="mt-2 text-slate-600">
                  {category.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                  Start Now
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
