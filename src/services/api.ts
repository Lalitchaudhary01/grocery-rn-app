export const defaultApiBaseUrl = 'https://grocery-app-flame-eight.vercel.app';

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
): Promise<ApiResult<T>> {
  const normalizedBaseUrl = (baseUrl || defaultApiBaseUrl).trim().replace(/\/+$/, '');
  const candidates = [normalizedBaseUrl];

  let lastNetworkError: string | null = null;

  for (const candidateBaseUrl of candidates) {
    try {
      const response = await fetch(`${candidateBaseUrl}${path}`, {
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
        return { ok: false, status: response.status, data: null, error: errorMessage };
      }

      return { ok: true, status: response.status, data: (json as T) ?? null, error: null };
    } catch (error) {
      lastNetworkError = error instanceof Error ? error.message : 'Network error';
    }
  }

  const lastTried = candidates[candidates.length - 1] || normalizedBaseUrl;
  return {
    ok: false,
    status: 0,
    data: null,
    error:
      lastNetworkError ||
      `Network request failed (${lastTried}${path}). Check emulator internet/date-time and HTTPS access.`,
  };
}
