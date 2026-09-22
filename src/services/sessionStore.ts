/**
 * Session Store for QPay Merchant
 * Stores user profile and access token.
 * Uses Capacitor Preferences on native platforms and sessionStorage on web.
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const USER_KEY = 'qpay_user';
const TOKEN_KEY = 'qpay_access_token';

let memoryToken: string | null = null;
let memoryUser: StoredUser | null = null;

export interface StoredUser {
  id: string;
  role: string;
  name: string;
  mobile: string;
  merchantCode?: string;
  businessName?: string;
}

export async function saveSession(user: StoredUser, accessToken: string): Promise<void> {
  memoryToken = accessToken;
  memoryUser = user;
  const userJson = JSON.stringify(user);
  try {
    sessionStorage.setItem(USER_KEY, userJson);
    sessionStorage.setItem(TOKEN_KEY, accessToken);
  } catch {
    // sessionStorage quota or security error
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.set({ key: USER_KEY, value: userJson });
      await Preferences.set({ key: TOKEN_KEY, value: accessToken });
    } catch {
      // Ignore native preference error
    }
  }
}

export async function getSession(): Promise<{ user: StoredUser; accessToken: string } | null> {
  if (memoryUser && memoryToken) {
    return { user: memoryUser, accessToken: memoryToken };
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const userRes = await Preferences.get({ key: USER_KEY });
      const tokenRes = await Preferences.get({ key: TOKEN_KEY });
      if (userRes.value && tokenRes.value) {
        const user = JSON.parse(userRes.value);
        memoryUser = user;
        memoryToken = tokenRes.value;
        return { user, accessToken: tokenRes.value };
      }
    } catch {
      // Preferences read error
    }
  }

  try {
    const userJson = sessionStorage.getItem(USER_KEY);
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (userJson && token) {
      const user = JSON.parse(userJson);
      memoryUser = user;
      memoryToken = token;
      return { user, accessToken: token };
    }
  } catch {
    // Parse error
  }

  return null;
}

export function getAccessToken(): string | null {
  if (memoryToken) return memoryToken;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  memoryToken = null;
  memoryUser = null;
  try {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.remove({ key: USER_KEY });
      await Preferences.remove({ key: TOKEN_KEY });
    } catch {
      // Ignore
    }
  }
}
