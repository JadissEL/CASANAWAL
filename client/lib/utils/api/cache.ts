// Cache utilities for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedResponse<T>(key: string): T | null {
  const cached = apiCache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    apiCache.delete(key);
    return null;
  }

  return cached.data;
}

export function setCachedResponse<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearApiCache(): void {
  apiCache.clear();
}
