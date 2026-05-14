import type {
  MapBounds,
  MapSourceKey,
} from "@/src/presentation/constants/map-config";

export interface MapMarker {
  id: string;
  source: MapSourceKey;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  subtitle?: string;
  contact?: string;
  tag?: string;
  status?: string;
  priority?: string;
  extra?: string;
}

export type { MapBounds, MapSourceKey };

