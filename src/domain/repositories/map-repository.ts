import type {
  MapBounds,
  MapMarker,
  MapSourceKey,
} from "@/src/domain/entities/map";

export interface GetMapMarkersParams {
  source: MapSourceKey;
  bounds?: MapBounds;
}

export interface IMapRepository {
  getMarkers(params: GetMapMarkersParams): Promise<MapMarker[]>;
}
