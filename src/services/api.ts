import { Platform } from 'react-native';

export const defaultApiBaseUrl = 'https://grocery-app-flame-eight.vercel.app';
const fallbackApiBaseUrls = ['http://10.0.2.2:3000', 'http://localhost:3000'] as const;

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

export async function requestApi<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
  options?: { allowFallback?: boolean },
): Promise<ApiResult<T>> {
  const normalizedBaseUrl = (baseUrl || defaultApiBaseUrl).trim().replace(/\/+$/, '');
  const shouldFallback = options?.allowFallback === true;
  const fallbackOrder =
    Platform.OS === 'android'
      ? [defaultApiBaseUrl, 'http://10.0.2.2:3000', 'http://localhost:3000']
      : [defaultApiBaseUrl, ...fallbackApiBaseUrls];
  const candidates = shouldFallback
    ? Array.from(new Set([normalizedBaseUrl, ...fallbackOrder]).values()).filter(Boolean)
    : [normalizedBaseUrl];

  let lastNetworkError: string | null = null;
  const attempts: string[] = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidateBaseUrl = candidates[index];
    const targetUrl = `${candidateBaseUrl}${path}`;
    try {
      const response = await fetch(targetUrl, {
        credentials: 'include',
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });

      const json = (await response.json().catch(() => null)) as T | { error?: string } | null;

      if (!response.ok) {
        const errorMessage =
          json && typeof json === 'object' && 'error' in json && typeof json.error === 'string'
            ? json.error
            : `Request failed (${response.status})`;

        // In dev mixed-host scenarios, retry the next base URL when auth fails.
        if (shouldFallback && (response.status === 401 || response.status === 403) && index < candidates.length - 1) {
          continue;
        }

        return { ok: false, status: response.status, data: null, error: errorMessage };
      }

      return { ok: true, status: response.status, data: (json as T) ?? null, error: null };
    } catch (error) {
      lastNetworkError = error instanceof Error ? error.message : 'Network error';
      attempts.push(`${targetUrl} -> ${lastNetworkError}`);
    }
  }

  const lastTried = candidates[candidates.length - 1] || normalizedBaseUrl;
  return {
    ok: false,
    status: 0,
    data: null,
    error:
      `${lastNetworkError || 'Network request failed'}\nTried: ${attempts.join(' | ') || `${lastTried}${path}`}`,
  };
}
