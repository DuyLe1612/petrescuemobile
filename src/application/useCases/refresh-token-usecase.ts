import { RefreshTokenRequestDto } from "@/src/application/dto/auth/refresh-dto";
import { RefreshTokenRequest } from "@/src/domain/entities/auth";
import { IAuthRepository } from "@/src/domain/repositories/auth-repository";

export class RefreshTokenUseCase {
  constructor(private repo: IAuthRepository) {}

  execute(data: RefreshTokenRequestDto) {
    return this.repo.refreshToken(mapToDomain(data));
  }
}

const mapToDomain = (data: RefreshTokenRequestDto): RefreshTokenRequest => ({
  refreshToken: data.refreshToken,
});
