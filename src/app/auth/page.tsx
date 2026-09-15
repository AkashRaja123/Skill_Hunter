"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/lib/db/types";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState<UserRole>("job_seeker");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const { signIn, signUp, signInWithGoogle, setRole } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (mode === "signup" && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setBusy(true);
        try {
            if (mode === "login") {
                await signIn(email, password);
            } else {
                await signUp(email, password, selectedRole);
            }
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "Something went wrong.";
            setError(msg.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim());
        } finally {
            setBusy(false);
        }
    }

    async function handleGoogle() {
        setError("");
        setBusy(true);
        try {
            await signInWithGoogle(mode === "signup" ? selectedRole : undefined);
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "Something went wrong.";
            setError(msg.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim());
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
            {/* Background grid overlay */}
            <div className="grid-overlay pointer-events-none fixed inset-0 -z-10 opacity-40" />

            <div className="card w-full max-w-md p-8 sm:p-10">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link href="/">
                        <BrandLogo />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex rounded-full border border-[var(--line)] bg-[var(--section)] p-1">
                    <button
                        type="button"
                        onClick={() => { setMode("login"); setError(""); }}
                        className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === "login"
                                ? "bg-white text-slate-950 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(""); }}
                        className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === "signup"
                                ? "bg-white text-slate-950 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>

                    {mode === "signup" && (
                        <div>
                            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-[var(--line)] bg-[var(--section)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                            />
                        </div>
                    )}

                    {mode === "signup" && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                I am a…
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("job_seeker")}
                                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                                        selectedRole === "job_seeker"
                                            ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]"
                                            : "border-[var(--line)] bg-[var(--section)] text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                    <span className="block text-lg mb-1">🎯</span>
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("hr_recruiter")}
                                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                                        selectedRole === "hr_recruiter"
                                            ? "border-[var(--primary)] bg-blue-50 text-[var(--primary)]"
                                            : "border-[var(--line)] bg-[var(--section)] text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                    <span className="block text-lg mb-1">👥</span>
                                    HR & Recruiter
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={busy}
                        className="pill mt-2 w-full bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy
                            ? "Please wait…"
                            : mode === "login"
                                ? "Log In"
                                : "Create Account"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-[var(--line)]" />
                    <span className="text-xs font-medium text-slate-400">OR</span>
                    <span className="h-px flex-1 bg-[var(--line)]" />
                </div>

                {/* Google */}
                <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                        <path
                            d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z"
                            fill="#34A853"
                        />
                        <path
                            d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3-2.33Z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                {/* Footer link */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => { setMode("signup"); setError(""); }}
                                className="font-semibold text-[var(--primary)] hover:underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => { setMode("login"); setError(""); }}
                                className="font-semibold text-[var(--primary)] hover:underline"
                            >
                                Log in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </main>
    );
}
