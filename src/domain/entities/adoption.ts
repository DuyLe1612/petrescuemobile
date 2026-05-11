export type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface AdoptionSummary {
  applicationId: string;
  adoptionCode?: string;
  petName?: string;
  petPrimaryImageUrl?: string;
  status: AdoptionStatus;
  experience?: string;
  liveCondition?: string;
  createdAt?: string;
}
