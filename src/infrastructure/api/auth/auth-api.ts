import { http } from "../client/http";

export interface ApiLoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface ApiRefreshTokenRequest {
  refreshToken: string;
}

export interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: ApiUser;
}

export interface ApiUser {
  userId: string;
  organizationId: string;
  organizationName: string;
  organizationRole: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export const AuthApi = {
  login(data: ApiLoginRequest) {
    // Debug log: inspect request payload to diagnose empty-body issues
    // NOTE: Remove or guard this in production.
    try {
      console.log("AuthApi.login payload:", JSON.stringify(data));
    } catch (e) {
      // ignore
    }

    const response = http.post<ApiLoginResponse, ApiLoginRequest>(
      "/api/v1/auth/login",
      data,
    );

    return response;
  },
  refresh(data: ApiRefreshTokenRequest) {
    const response = http.post<ApiLoginResponse, ApiRefreshTokenRequest>(
      "/api/v1/auth/refresh",
      data,
    );

    return response;
  },
};
