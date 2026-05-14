import { AdoptionSummary } from "@/src/domain/entities/adoption";

export interface GetMyAdoptionsParams {
  page?: number;
  size?: number;
}

export interface IAdoptionRepository {
  getMyAdoptions(params?: GetMyAdoptionsParams): Promise<AdoptionSummary[]>;
}
