import { storage } from "./mmkv";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenStorage = {
  set(accessToken: string, refreshToken?: string) {
    storage.set(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  getAccessToken() {
    return storage.getString(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return storage.getString(REFRESH_TOKEN_KEY);
  },

  clear() {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },
};
