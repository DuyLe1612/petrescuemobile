export interface ProvinceSummary {
  code: string;
  name: string;
  codename?: string;
  divisionType?: string;
  phoneCode?: number;
}

export interface WardSummary {
  code: string;
  name: string;
  codename?: string;
  divisionType?: string;
  provinceCode?: string;
}

export interface ProvinceDetail extends ProvinceSummary {
  wards: WardSummary[];
}
