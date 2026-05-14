import type { ProvinceSummary } from "@/src/domain/entities/location";
import type {
    IProvinceRepository,
    ProvinceQueryParams,
} from "@/src/domain/repositories/province-repository";

export class GetProvincesUseCase {
  constructor(private readonly repo: IProvinceRepository) {}

  execute(params?: ProvinceQueryParams): Promise<ProvinceSummary[]> {
    return this.repo.listProvinces(params);
  }
}
