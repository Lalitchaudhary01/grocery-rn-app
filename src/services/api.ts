import { Platform } from 'react-native';

export const defaultApiBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

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
  try {
    const response = await fetch(`${baseUrl}${path}`, {
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
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
