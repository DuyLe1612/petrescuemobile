export type ProvinceApiProvince = {
  code: number;
  codename?: string;
  division_type?: string;
  name: string;
  phone_code?: number;
};

export type ProvinceApiWard = {
  code: number;
  codename?: string;
  division_type?: string;
  name: string;
  province_code?: number;
};

export type ProvinceApiDetail = ProvinceApiProvince & {
  wards?: ProvinceApiWard[];
};

const BASE_URL = "https://provinces.open-api.vn/api/v2";

export const provinceApi = {
  async listProvinces() {
    const response = await fetch(`${BASE_URL}/p`);
    if (!response.ok) {
      throw new Error("Failed to load provinces");
    }
    return (await response.json()) as ProvinceApiProvince[];
  },

  async getProvinceDetail(code: string, depth = 2) {
    const response = await fetch(`${BASE_URL}/p/${code}?depth=${depth}`);
    if (!response.ok) {
      throw new Error("Failed to load province detail");
    }
    return (await response.json()) as ProvinceApiDetail;
  },
};
