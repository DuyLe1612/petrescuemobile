import {
    GetMyAdoptionsParams,
    IAdoptionRepository,
} from "@/src/domain/repositories/adoption-repository";

export class GetMyAdoptionsUseCase {
  constructor(private repo: IAdoptionRepository) {}

  execute(params?: GetMyAdoptionsParams) {
    return this.repo.getMyAdoptions(params);
  }
}
