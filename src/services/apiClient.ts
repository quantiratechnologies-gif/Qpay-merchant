/**
 * API Client for QPay Merchant
 * Base URL from VITE_API_BASE_URL env var.
 * Attaches Bearer token from session storage.
 * On 401: clears session and redirects to login.
 */

import { clearSession, getAccessToken } from './sessionStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearSession();
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `HTTP ${res.status}`) as Error & {
      status: number;
      code?: string;
      data?: unknown;
    };
    err.status = res.status;
    err.code = data?.code;
    err.data = data;
    throw err;
  }

  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  return request<T>('POST', path, body);
}
