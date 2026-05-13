import type { MapSourceKey } from "@/src/presentation/constants/map-config";

type MapEndpointConfig = {
  markersPath: string;
  bboxPath: string;
};

export const MAP_API_ENDPOINTS: Record<MapSourceKey, MapEndpointConfig> = {
  rescue: {
    markersPath: "/api/v1/map/rescue/markers",
    bboxPath: "/api/v1/map/rescue/bounding-box",
  },
  organization: {
    markersPath: "/api/v1/map/organizations/markers",
    bboxPath: "/api/v1/map/organizations/bounding-box",
  },
};
