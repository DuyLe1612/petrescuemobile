import { AuthResponse, LoginRequest } from "../entities/auth";

export interface AuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>;
}
