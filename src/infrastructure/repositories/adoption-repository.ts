import { AdoptionSummary, AdoptionStatus } from "@/src/domain/entities/adoption";
import {
  IAdoptionRepository,
  GetMyAdoptionsParams,
} from "@/src/domain/repositories/adoption-repository";
import {
  getByUserId,
  getCurrentUser,
} from "@/src/infrastructure/api/generated/pet-rescue-api";
import type { AdoptionSummaryResponseDto } from "@/src/infrastructure/api/generated/model";

const normalizeStatus = (status?: AdoptionStatus): AdoptionStatus => {
  return status ?? "PENDING";
};

export class ApiAdoptionRepository implements IAdoptionRepository {
  async getMyAdoptions(params?: GetMyAdoptionsParams): Promise<AdoptionSummary[]> {
    const user = await getCurrentUser();
    const userId = user.data?.userId;

    if (!userId) {
      return [];
    }

    const response = await getByUserId(userId, {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    });

    const items = response.data?.content ?? [];
    return items.map(mapSummary);
  }
}

const mapSummary = (data: AdoptionSummaryResponseDto): AdoptionSummary => {
  return {
    applicationId: data.applicationId ?? "",
    adoptionCode: data.adoptionCode,
    petName: data.petName,
    petPrimaryImageUrl: data.petPrimaryImageUrl,
    status: normalizeStatus(data.status as AdoptionStatus | undefined),
    experience: data.experience,
    liveCondition: data.liveCondition,
    createdAt: data.createdAt,
  };
};
