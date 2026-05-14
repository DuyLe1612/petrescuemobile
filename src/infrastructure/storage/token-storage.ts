import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const webStorage = {
  getItem(key: string) {
    return globalThis.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    globalThis.localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    globalThis.localStorage.removeItem(key);
  },
};

export const tokenStorage = {
  async set(accessToken: string, refreshToken?: string) {
    if (Platform.OS === "web") {
      webStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

      if (refreshToken) {
        webStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      return;
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
    // notify subscribers
    try {
      tokenChangeListeners.forEach((l) => l());
    } catch (e) {
      // ignore
    }
  },

  async getAccessToken() {
    if (Platform.OS === "web") {
      return webStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    if (Platform.OS === "web") {
      return webStorage.getItem(REFRESH_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clear() {
    if (Platform.OS === "web") {
      webStorage.removeItem(ACCESS_TOKEN_KEY);
      webStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    try {
      tokenChangeListeners.forEach((l) => l());
    } catch (e) {
      // ignore
    }
  },
};

// Simple change-listener API so other modules can react to token updates.
type TokenChangeListener = () => void;
const tokenChangeListeners: TokenChangeListener[] = [];

export const addTokenChangeListener = (fn: TokenChangeListener) => {
  tokenChangeListeners.push(fn);
  return () => {
    const idx = tokenChangeListeners.indexOf(fn);
    if (idx >= 0) tokenChangeListeners.splice(idx, 1);
  };
};
