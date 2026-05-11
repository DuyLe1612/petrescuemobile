import {
    AuthResponse,
    LoginRequest,
    RefreshTokenRequest,
} from "../entities/auth";

export interface IAuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>;
  refreshToken(data: RefreshTokenRequest): Promise<AuthResponse>;
}
