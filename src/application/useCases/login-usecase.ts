import { AuthRepository } from "@/src/domain/repositories/auth-repository";
import { LoginRequestDto } from "../dto/auth/login-dto";

export class LoginUseCase {
  constructor(private repo: AuthRepository) {}

  execute(data: LoginRequestDto) {
    return this.repo.login(data);
  }
}
