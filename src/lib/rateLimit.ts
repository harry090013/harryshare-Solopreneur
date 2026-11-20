// Lightweight in-memory sliding-window rate limiter for public API routes

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 5000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Prevent unbounded memory growth on long-lived instances
  if (store.size > MAX_STORE_SIZE) {
    for (const [k, v] of store.entries()) {
      const fresh = v.timestamps.filter((t) => now - t < windowMs);
      if (fresh.length === 0) {
        store.delete(k);
      } else {
        v.timestamps = fresh;
      }
    }
  }

  const entry = store.get(key) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    store.set(key, entry);
    return { allowed: false, retryAfterSec };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true, retryAfterSec: 0 };
}
