/**
 * Session Storage utility for Skill Hunter.
 *
 * Persists parsed resume data, ATS results, and dashboard state
 * within the browser tab so refreshes don't lose progress.
 *
 * Uses `sessionStorage` (not `localStorage`) so data is automatically
 * cleared when the tab is closed.
 */

const PREFIX = "skill_hunter_";

/** Storage keys for different state slices. */
export const SESSION_KEYS = {
  PARSED_RESULTS: `${PREFIX}parsed_results`,
  UPLOADED_RESUME: `${PREFIX}uploaded_resume`,
  ATS_RESULTS: `${PREFIX}ats_results`,
  SELECTED_JOB: `${PREFIX}selected_job`,
  MATCHED_JOBS: `${PREFIX}matched_jobs`,
} as const;

type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];

/**
 * Save a value to sessionStorage as JSON.
 * Silently fails if sessionStorage is unavailable (e.g. SSR).
 */
export function setSession<T>(key: SessionKey, value: T): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private browsing — fail silently.
  }
}

/**
 * Retrieve a value from sessionStorage, parsed from JSON.
 * Returns `null` if the key does not exist or parsing fails.
 */
export function getSession<T>(key: SessionKey): T | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Remove a single key from sessionStorage.
 */
export function removeSession(key: SessionKey): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

/**
 * Clear ALL Skill Hunter keys from sessionStorage.
 * Useful on sign-out or when the user wants a fresh start.
 */
export function clearAllSessions(): void {
  try {
    if (typeof window === "undefined") return;
    Object.values(SESSION_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  } catch {
    // Ignore
  }
}
