import type { ProvinceDetail } from "@/src/domain/entities/location";
import type { IProvinceRepository } from "@/src/domain/repositories/province-repository";

export class GetProvinceDetailUseCase {
  constructor(private readonly repo: IProvinceRepository) {}

  execute(code: string, depth = 2): Promise<ProvinceDetail> {
    return this.repo.getProvinceDetail(code, depth);
  }
}
