import { LoginRequestDto } from "@/src/application/dto/auth/login-dto";
import { LoginRequest } from "@/src/domain/entities/auth";
import { IAuthRepository } from "@/src/domain/repositories/auth-repository";

export class LoginUseCase {
  constructor(private repo: IAuthRepository) {}

  execute(data: LoginRequestDto) {
    return this.repo.login(mapToDomain(data));
  }
}

const mapToDomain = (data: LoginRequestDto): LoginRequest => ({
  emailOrUsername: data.emailOrUsername,
  password: data.password,
});
