import type {
    ProvinceDetail,
    ProvinceSummary,
} from "@/src/domain/entities/location";
import type {
    IProvinceRepository,
    ProvinceQueryParams,
} from "@/src/domain/repositories/province-repository";
import { provinceApi } from "@/src/infrastructure/api/location/province-api";

export class ApiProvinceRepository implements IProvinceRepository {
  async listProvinces(
    params?: ProvinceQueryParams,
  ): Promise<ProvinceSummary[]> {
    const items = await provinceApi.listProvinces();
    const search = params?.search?.trim().toLowerCase() ?? "";
    const filtered = search
      ? items.filter((item) => item.name.toLowerCase().includes(search))
      : items;

    return filtered
      .map(mapProvinceSummary)
      .slice(0, params?.size ?? filtered.length);
  }

  async getProvinceDetail(code: string, depth = 2): Promise<ProvinceDetail> {
    const item = await provinceApi.getProvinceDetail(code, depth);
    return mapProvinceDetail(item);
  }
}

const mapProvinceSummary = (item: {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
  phone_code?: number;
}): ProvinceSummary => ({
  code: String(item.code),
  name: item.name,
  codename: item.codename,
  divisionType: item.division_type,
  phoneCode: item.phone_code,
});

const mapProvinceDetail = (item: {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
  phone_code?: number;
  wards?: Array<{
    code: number;
    name: string;
    codename?: string;
    division_type?: string;
    province_code?: number;
  }>;
}): ProvinceDetail => ({
  code: String(item.code),
  name: item.name,
  codename: item.codename,
  divisionType: item.division_type,
  phoneCode: item.phone_code,
  wards: (item.wards ?? []).map((ward) => ({
    code: String(ward.code),
    name: ward.name,
    codename: ward.codename,
    divisionType: ward.division_type,
    provinceCode: ward.province_code ? String(ward.province_code) : undefined,
  })),
});
