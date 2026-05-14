export type MapSourceKey = "rescue" | "organization";

export type MapBounds = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export type MapSourceConfig = {
  key: MapSourceKey;
  label: string;
  shortLabel: string;
  color: string;
  tint: string;
};

export const MAP_SOURCE_CONFIGS: Record<MapSourceKey, MapSourceConfig> = {
  rescue: {
    key: "rescue",
    label: "Cứu hộ",
    shortLabel: "Cứu hộ",
    color: "#FF584F",
    tint: "#FFF0EF",
  },
  organization: {
    key: "organization",
    label: "Tổ chức",
    shortLabel: "Tổ chức",
    color: "#03354F",
    tint: "#EEF5F9",
  },
};

export const DEFAULT_MAP_SOURCE: MapSourceKey = "rescue";

export const DEFAULT_MAP_BOUNDS: MapBounds = {
  minLat: 20.97,
  minLng: 105.78,
  maxLat: 21.07,
  maxLng: 105.89,
};

export const MAP_VIEWPORT = {
  latitude: 21.0285,
  longitude: 105.838,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const MAP_PANEL_HEIGHT = 360;
