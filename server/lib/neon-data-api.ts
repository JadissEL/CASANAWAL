import fetch from 'node-fetch';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface NeonRequestOptions {
  method?: HttpMethod;
  path: string; // e.g. /tables
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  bearerToken?: string; // If using JWT-based auth
}

const BASE = (process.env.NEON_DATA_API_BASE || '').replace(/\/$/, '');

export async function neonRequest<T = any>({ method = 'GET', path, query, body, bearerToken }: NeonRequestOptions): Promise<T> {
  if (!BASE) throw new Error('NEON_DATA_API_BASE is not set');

  const qs = query
    ? '?' + Object.entries(query)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const url = `${BASE}${path}${qs}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = process.env.NEON_DATA_API_KEY;
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  } as any);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon Data API ${res.status}: ${text}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  // @ts-ignore allow text fallback
  return (await res.text()) as T;
}

export async function neonHealthCheck(): Promise<boolean> {
  try {
    // Use a small query to validate access; adjust to a small table if needed
    await neonRequest({ path: '/tables', method: 'GET' });
    return true;
  } catch (e) {
    return false;
  }
}


