/**
 * Simple in-memory cache for 24-hour tech news refresh
 * Stores the last fetch timestamp and report data
 */

interface CachedTechReport {
  data: any;
  timestamp: number;
  expiresAt: number;
}

// In-memory cache (will reset on server restart)
let cache: CachedTechReport | null = null;

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get cached report if still valid (within 24 hours)
 */
export function getCachedReport() {
  if (!cache) return null;

  const now = Date.now();
  if (now > cache.expiresAt) {
    // Cache expired
    cache = null;
    return null;
  }

  return cache;
}

/**
 * Check if cache is still valid (within 24 hours)
 */
export function isCacheValid(): boolean {
  if (!cache) return false;
  return Date.now() <= cache.expiresAt;
}

/**
 * Store report in cache with 24-hour expiration
 */
export function setCachedReport(data: any) {
  const now = Date.now();
  cache = {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION_MS,
  };
}

/**
 * Get time remaining until cache expires (in milliseconds)
 */
export function getCacheTimeRemaining(): number {
  if (!cache) return 0;
  const remaining = cache.expiresAt - Date.now();
  return Math.max(0, remaining);
}

/**
 * Get cache expiration time as ISO string
 */
export function getCacheExpirationTime(): string | null {
  if (!cache) return null;
  return new Date(cache.expiresAt).toISOString();
}

/**
 * Force clear cache (useful for testing or manual refresh)
 */
export function clearCache() {
  cache = null;
}

/**
 * Get formatted time remaining string (e.g., "23h 45m remaining")
 */
export function getFormattedTimeRemaining(): string {
  const ms = getCacheTimeRemaining();
  if (ms === 0) return "0m remaining";

  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}
