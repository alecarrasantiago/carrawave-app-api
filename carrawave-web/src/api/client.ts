import { tokenStore, getOrCreateDeviceId } from './identity';
import type { ApiErrorBody, AuthResponse } from './types';

// Nunca hard-code a URL da API no código — sempre variável de ambiente, para
// trocar de domínio (dev -> produção) sem reconstruir o app.
const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL não definida — configure um .env.local (veja .env.example).');
}

export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.status = body.status;
    this.errorCode = body.error;
  }
}

function detectPlatform(): 'WEB' | 'ANDROID' | 'IOS' {
  // Quando o Capacitor for adicionado, ele injeta window.Capacitor — a
  // detecção já fica pronta para esse dia, sem precisar mexer aqui de novo.
  const w = window as unknown as { Capacitor?: { getPlatform?: () => string } };
  const platform = w.Capacitor?.getPlatform?.();
  if (platform === 'android') return 'ANDROID';
  if (platform === 'ios') return 'IOS';
  return 'WEB';
}

let bootstrapPromise: Promise<void> | null = null;
let refreshPromise: Promise<boolean> | null = null;

async function doAnonymousAuth(): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const res = await fetch(`${API_URL}/api/v1/auth/anonymous`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId,
      platform: detectPlatform(),
      appVersion: '0.1.0',
      osVersion: navigator.userAgent.slice(0, 120),
      locale: navigator.language ?? 'pt-BR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  });
  if (!res.ok) {
    throw new Error('Não foi possível iniciar sessão anônima.');
  }
  const data: AuthResponse = await res.json();
  tokenStore.setTokens(data.accessToken, data.refreshToken, data.accountType);
}

/**
 * Garante que existe um token válido antes de qualquer chamada. O usuário
 * NUNCA vê tela de login — isso roda silenciosamente no primeiro acesso.
 */
export function ensureIdentity(): Promise<void> {
  if (tokenStore.getAccessToken()) {
    return Promise.resolve();
  }
  if (!bootstrapPromise) {
    bootstrapPromise = doAnonymousAuth().finally(() => {
      bootstrapPromise = null;
    });
  }
  return bootstrapPromise;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    tokenStore.clear();
    return false;
  }
  const data: AuthResponse = await res.json();
  tokenStore.setTokens(data.accessToken, data.refreshToken, data.accountType);
  return true;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  await ensureIdentity();

  const doRequest = async (): Promise<Response> => {
    const token = tokenStore.getAccessToken();
    return fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'pt-BR',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  };

  let res = await doRequest();

  if (res.status === 401) {
    const body: ApiErrorBody = await res.clone().json().catch(() => null as unknown as ApiErrorBody);
    if (body?.error === 'TOKEN_EXPIRED' || body?.error === 'UNAUTHENTICATED') {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshed = await refreshPromise;
      if (refreshed) {
        res = await doRequest();
      }
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({
      timestamp: new Date().toISOString(),
      status: res.status,
      error: 'UNKNOWN_ERROR',
      message: 'Algo deu errado. Tente novamente.',
      path,
    }));
    throw new ApiError(body);
  }

  return res.json() as Promise<T>;
}
