import { LoginUseCase } from "@/src/application/useCases/login-usecase";
import { ApiAuthRepository } from "../repositories/auth-repository";

const authRepository = new ApiAuthRepository();

export const authModule = {
  loginUseCase: new LoginUseCase(authRepository),
};
