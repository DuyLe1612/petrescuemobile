import {
    AuthResponse,
    LoginRequest,
    RefreshTokenRequest,
} from "@/src/domain/entities/auth";
import { UserEntity } from "@/src/domain/entities/user";
import { IAuthRepository } from "@/src/domain/repositories/I-auth-repository";
import {
    ApiLoginRequest,
    ApiLoginResponse,
    ApiUser,
    AuthApi,
} from "../api/auth/auth-api";

export class ApiAuthRepository implements IAuthRepository {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await AuthApi.login(mapLoginRequest(data));
    return mapAuthResponse(response.data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await AuthApi.refresh({ refreshToken: data.refreshToken });
    return mapAuthResponse(response.data);
  }

  // async logout(): Promise<void> {
  //   await http.post("/auth/logout");
  // }

  // async refreshToken(refreshToken: string): Promise<AuthSession> {
  //   const response = await http.post<
  //     ApiResponseDto<LoginResponseDto>,
  //     { refreshToken: string }
  //   >("/auth/refresh", {
  //     refreshToken,
  //   });

  //   return authMapper.toAuthSession(response.data);
  // }

  // async getMe(): Promise<AuthSession["user"]> {
  //   const response =
  //     await http.get<ApiResponseDto<LoginResponseDto["data"]["user"]>>(
  //       "/auth/me",
  //     );

  //   return authMapper.toCurrentUser(response.data.data);
  // }
}

const mapLoginRequest = (data: LoginRequest): ApiLoginRequest => ({
  emailOrUsername: data.emailOrUsername,
  password: data.password,
});

const mapAuthResponse = (data: ApiLoginResponse): AuthResponse => ({
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
  tokenType: data.tokenType,
  expiresIn: data.expiresIn,
  user: mapUser(data.user),
});

const mapUser = (data: ApiUser): UserEntity => ({
  userId: data.userId,
  organizationId: data.organizationId,
  organizationName: data.organizationName,
  organizationRole: data.organizationRole,
  username: data.username,
  email: data.email,
  fullName: data.fullName,
  phone: data.phone,
  gender: data.gender,
  streetAddress: data.streetAddress,
  wardName: data.wardName,
  provinceName: data.provinceName,
  status: data.status,
  emailVerified: data.emailVerified,
  roles: data.roles,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
