import { GetMapMarkersUseCase } from "@/src/application/useCases/get-map-markers-usecase";
import { ApiMapRepository } from "@/src/infrastructure/repositories/map-repository";

const mapRepository = new ApiMapRepository();

export const mapModule = {
  mapRepository,
  getMapMarkersUseCase: new GetMapMarkersUseCase(mapRepository),
};
