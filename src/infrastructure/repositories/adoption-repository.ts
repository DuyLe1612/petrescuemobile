import {
    AdoptionStatus,
    AdoptionSummary,
} from "@/src/domain/entities/adoption";
import {
    GetMyAdoptionsParams,
    IAdoptionRepository,
} from "@/src/domain/repositories/adoption-repository";
import type { AdoptionSummaryResponseDto } from "@/src/infrastructure/api/generated/model";
import {
    getByUserId,
    getCurrentUser,
} from "@/src/infrastructure/api/generated/pet-rescue-api";

const normalizeStatus = (status?: AdoptionStatus): AdoptionStatus => {
  return status ?? "PENDING";
};

export class ApiAdoptionRepository implements IAdoptionRepository {
  async getMyAdoptions(
    params?: GetMyAdoptionsParams,
  ): Promise<AdoptionSummary[]> {
    const user = await getCurrentUser();
    const userId = user.data?.userId;

    if (!userId) {
      return [];
    }

    const response = await getByUserId(userId, {
      page: params?.page ?? 0,
      pageSize: params?.size ?? 20,
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
