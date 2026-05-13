import type { MapMarker } from "@/src/domain/entities/map";
import type {
  GetMapMarkersParams,
  IMapRepository,
} from "@/src/domain/repositories/I-map-repository";

export class GetMapMarkersUseCase {
  constructor(private readonly repo: IMapRepository) {}

  execute(params: GetMapMarkersParams): Promise<MapMarker[]> {
    return this.repo.getMarkers(params);
  }
}
