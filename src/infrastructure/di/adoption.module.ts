import { GetMyAdoptionsUseCase } from "@/src/application/useCases/get-my-adoptions-usecase";
import { ApiAdoptionRepository } from "@/src/infrastructure/repositories/adoption-repository";

const adoptionRepository = new ApiAdoptionRepository();
const getMyAdoptionsUseCase = new GetMyAdoptionsUseCase(adoptionRepository);

export const adoptionModule = {
  getMyAdoptionsUseCase,
};
