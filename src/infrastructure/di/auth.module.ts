import { LoginUseCase } from "@/src/application/useCases/login-usecase";
import { RefreshTokenUseCase } from "@/src/application/useCases/refresh-token-usecase";
import { ApiAuthRepository } from "../repositories/auth-repository";

const authRepository = new ApiAuthRepository();

export const authModule = {
  loginUseCase: new LoginUseCase(authRepository),
  refreshTokenUseCase: new RefreshTokenUseCase(authRepository),
};
