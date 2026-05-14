import type {
    ProvinceDetail,
    ProvinceSummary,
} from "@/src/domain/entities/location";

export interface ProvinceQueryParams {
  search?: string;
  page?: number;
  size?: number;
}

export interface IProvinceRepository {
  listProvinces(params?: ProvinceQueryParams): Promise<ProvinceSummary[]>;
  getProvinceDetail(code: string, depth?: number): Promise<ProvinceDetail>;
}
