import { storage } from './storage';

const DEVICE_ID_KEY = 'cw.deviceId';
const ACCESS_TOKEN_KEY = 'cw.accessToken';
const REFRESH_TOKEN_KEY = 'cw.refreshToken';
const ACCOUNT_TYPE_KEY = 'cw.accountType';

function uuidv4(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback simples para navegadores muito antigos.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateDeviceId(): string {
  let id = storage.get(DEVICE_ID_KEY);
  if (!id) {
    id = uuidv4();
    storage.set(DEVICE_ID_KEY, id);
  }
  return id;
}

export const tokenStore = {
  getAccessToken: () => storage.get(ACCESS_TOKEN_KEY),
  getRefreshToken: () => storage.get(REFRESH_TOKEN_KEY),
  getAccountType: () => storage.get(ACCOUNT_TYPE_KEY),
  setTokens(accessToken: string, refreshToken: string, accountType: string) {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
    storage.set(ACCOUNT_TYPE_KEY, accountType);
  },
  clear() {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(ACCOUNT_TYPE_KEY);
  },
};
