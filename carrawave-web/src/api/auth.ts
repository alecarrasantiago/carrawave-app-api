import { apiFetch } from './client';
import { tokenStore, getOrCreateDeviceId } from './identity';
import type { AuthResponse } from './types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const deviceId = getOrCreateDeviceId();
  const res = await apiFetch<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password, deviceId },
  });
  tokenStore.setTokens(res.accessToken, res.refreshToken, res.accountType);
  return res;
}

export async function register(displayName: string, email: string, password: string): Promise<AuthResponse> {
  const deviceId = getOrCreateDeviceId();
  const res = await apiFetch<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: { displayName, email, password, deviceId },
  });
  tokenStore.setTokens(res.accessToken, res.refreshToken, res.accountType);
  return res;
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStore.getRefreshToken();
  tokenStore.clear();
  if (refreshToken) {
    await apiFetch('/api/v1/auth/logout', { method: 'POST', body: { refreshToken } }).catch(() => {
      // Mesmo se a chamada falhar, o cliente já está deslogado localmente.
    });
  }
}
