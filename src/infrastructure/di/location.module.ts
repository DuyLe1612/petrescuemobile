import { GetProvinceDetailUseCase } from "@/src/application/useCases/get-province-detail-usecase";
import { GetProvincesUseCase } from "@/src/application/useCases/get-provinces-usecase";
import { ApiProvinceRepository } from "@/src/infrastructure/repositories/province-repository";

const provinceRepository = new ApiProvinceRepository();

export const locationModule = {
  provinceRepository,
  getProvincesUseCase: new GetProvincesUseCase(provinceRepository),
  getProvinceDetailUseCase: new GetProvinceDetailUseCase(provinceRepository),
};
