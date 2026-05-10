import { AuthResponse } from "@/src/domain/entities/auth";
import { AuthRepository } from "@/src/domain/repositories/auth-repository";
import { LoginRequestDTO, LoginResponseDTO } from "../api/auth/auth-api";
import { http } from "../api/client/http";

export class ApiAuthRepository implements AuthRepository {
  async login(data: LoginRequestDTO): Promise<AuthResponse> {
    const response = await http.post<LoginResponseDTO, LoginRequestDTO>(
      "/auth/login",
      data,
    );

    return response.data;
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
