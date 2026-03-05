"use client";

import Link from "next/link";
import { useState } from "react";

import { FileUploadBox } from "@/components/file-upload-box";
import { SiteNavbar } from "@/components/site-navbar";

export function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setError(null);

    try {
      // Read file content
      const text = await readFileAsText(file);

      // Call parsing API
      const formData = new FormData();
      formData.append("resumeText", text);
      formData.append("isPDF", file.type === "application/pdf" ? "true" : "false");

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to parse resume");
      }

      // Save parsed resume to backend
      const saveResponse = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: "demo_user", // Replace with actual user ID from auth
          parsedData: result.data.parsedData,
          aiAnalysis: result.data.aiAnalysis
        })
      });

      const savedResume = await saveResponse.json();

      if (!savedResume.success) {
        throw new Error(savedResume.error || "Failed to save resume");
      }

      setUploadedResume({
        id: savedResume.data.resumeId,
        name: file.name
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process resume");
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (!result) {
            reject(new Error("Failed to read file"));
            return;
          }

          // For PDFs, we need to parse them first
          if (file.type === "application/pdf") {
            // Send as base64 for PDF files
            const base64 = btoa(
              new Uint8Array(result as ArrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            resolve(base64);
          } else {
            resolve(result as string);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      // Read as ArrayBuffer for PDFs, as text for others
      if (file.type === "application/pdf") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  return (
    <main>
      <SiteNavbar />

      <section className="section-pad bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="container-shell">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline">
              ← Back to Home
            </Link>

            <h1 className="mt-6 font-heading text-4xl font-bold text-slate-950 md:text-5xl">
              Upload Your Resume
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Start your ATS optimization journey. Upload your resume and we'll parse it into structured data, analyze your
              strengths, and find the best-fit job opportunities for you.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">1</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Upload</p>
                <p className="mt-1 text-xs text-slate-600">Drop or select your resume file</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">2</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Parse</p>
                <p className="mt-1 text-xs text-slate-600">AI extracts structured data</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">3</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Optimize</p>
                <p className="mt-1 text-xs text-slate-600">Match jobs & improve ATS scores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          {!uploadedResume ? (
            <>
              <FileUploadBox onFileSelect={handleFileSelect} isLoading={isProcessing} />

              {selectedFile && !error && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-900">Selected file: {selectedFile.name}</p>
                  <p className="text-xs text-emerald-700">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-900">Error</p>
                  <p className="text-xs text-red-700">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs font-semibold text-red-900 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="mt-8 space-y-3">
                <h2 className="font-heading text-lg font-semibold text-slate-900">What happens next?</h2>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[var(--primary)]">•</span>
                    <span>Your resume is parsed into skills, experience, education, and projects.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-[var(--primary)]">•</span>
                    <span>AI analyzes strengths and areas for improvement.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-[var(--primary)]">•</span>
                    <span>You get matched with relevant job opportunities.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-[var(--primary)]">•</span>
                    <span>
                      Select a job and we calculate your ATS score with specific improvement suggestions.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-[var(--primary)]">•</span>
                    <span>
                      Iterate through suggestions until your resume hits the 90+ threshold for ATS systems.
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold text-emerald-900">Resume Uploaded!</h2>
                <p className="mt-2 text-sm text-emerald-800">
                  {uploadedResume.name} has been successfully uploaded and parsed.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-slate-900">What&apos;s next?</h3>
                <p className="text-sm text-slate-600">
                  Your resume data is now ready. In the next step, you&apos;ll see:
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3 text-left">
                    <span className="font-semibold text-[var(--primary)]">→</span>
                    <span>Parsed resume data (skills, experience, education)</span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <span className="font-semibold text-[var(--primary)]">→</span>
                    <span>AI analysis of strengths and improvement areas</span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <span className="font-semibold text-[var(--primary)]">→</span>
                    <span>Matched job opportunities sorted by fit score</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setUploadedResume(null);
                  setSelectedFile(null);
                }}
                className="pill inline-flex border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
              >
                Upload Another Resume
              </button>

              <Link
                href="/results"
                className="pill inline-flex bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                View Parsed Data & Results
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
