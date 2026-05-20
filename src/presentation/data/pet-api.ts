import type { AdoptionPet, PaginatedPets, PetFilters } from "@/src/domain/entities/adoption-pet";
import type { PetDiaryEntry, MyPetRecord, PetTone } from "@/src/presentation/data/my-pet-types";
import {
  createAsUser,
  getAvailable,
  getById2,
  getByUser,
  getCurrentUser,
  getMedia,
  getOwnerships,
  update2,
} from "@/src/infrastructure/api/generated/pet-rescue-api";
import type {
  MediaFileResponseDto,
  PetOwnershipResponseDto,
  PetResponseDto,
  PetSummaryResponseDto,
  UpdatePetRequestDto,
} from "@/src/infrastructure/api/generated/model";
import { CreatePetRequestDtoGender } from "@/src/infrastructure/api/generated/model";

const PAGE_SIZE = 6;

const toSpecies = (value?: string): AdoptionPet["species"] => {
  switch ((value ?? "").toLowerCase()) {
    case "cat":
    case "mèo":
      return "cat";
    case "bird":
      return "bird";
    case "rabbit":
      return "rabbit";
    default:
      return "dog";
  }
};

const toGender = (value?: string): AdoptionPet["gender"] => {
  return (value ?? "").toUpperCase() === "FEMALE" ? "female" : "male";
};

const formatLocation = (ward?: string | null, province?: string | null) => {
  return [ward, province].filter(Boolean).join(", ") || "Chưa cập nhật địa điểm";
};

const toAgeLabel = (ageDisplay?: string | null, age?: number | null) => {
  if (ageDisplay) return ageDisplay;
  if (typeof age !== "number") return "Chưa rõ tuổi";
  if (age < 12) return `${age} tháng`;
  const years = Math.floor(age / 12);
  const months = age % 12;
  return months > 0 ? `${years} tuổi ${months} tháng` : `${years} tuổi`;
};

const toneFromHealth = (value?: string | null): PetTone => {
  switch ((value ?? "").toUpperCase()) {
    case "CRITICAL":
    case "POOR":
    case "SICK":
      return "alert";
    case "RECOVERING":
    case "FAIR":
      return "warning";
    default:
      return "good";
  }
};

const labelFromHealth = (value?: string | null) => {
  switch ((value ?? "").toUpperCase()) {
    case "CRITICAL":
      return "Khẩn cấp";
    case "SICK":
    case "POOR":
      return "Cần theo dõi";
    case "RECOVERING":
    case "FAIR":
      return "Đang hồi phục";
    case "GOOD":
      return "Khỏe mạnh";
    default:
      return "Đang chăm sóc";
  }
};

const buildHealthBadges = (pet: Pick<PetResponseDto, "vaccinated" | "neutered" | "healthStatus">) => {
  const badges = [labelFromHealth(pet.healthStatus)];
  if (pet.vaccinated) badges.push("Đã tiêm vaccine");
  if (pet.neutered) badges.push("Đã triệt sản");
  return badges;
};

const mapSummaryToAdoptionPet = (pet: PetSummaryResponseDto): AdoptionPet => ({
  id: pet.petId ?? pet.petCode ?? `${pet.name}-${pet.imageUrl}`,
  name: pet.name ?? "Chưa đặt tên",
  species: toSpecies(pet.species),
  breed: pet.breed ?? "Chưa rõ giống",
  ageLabel: toAgeLabel(pet.ageDisplay, pet.age),
  gender: toGender(pet.gender),
  location: formatLocation(pet.ward, pet.province),
  imageUrl: pet.imageUrl ?? "https://placehold.co/800x600?text=Pet",
  vaccinated: Boolean(pet.vaccinated),
  adult: (pet.age ?? 0) >= 12,
  favorite: false,
  badge: labelFromHealth(pet.healthStatus),
  description: `${pet.name ?? "Bé cưng"} đang chờ một mái ấm phù hợp.`,
  shelterName: pet.organization?.name ?? pet.owner?.name ?? "Pet Rescue",
  healthBadges: buildHealthBadges(pet),
  story: "Thông tin chi tiết về hành trình của bé sẽ được cập nhật từ hồ sơ rescue.",
});

const mapDetailToAdoptionPet = (pet: PetResponseDto): AdoptionPet => ({
  id: pet.petId ?? pet.petCode ?? `${pet.name}-${pet.createdAt}`,
  name: pet.name ?? "Chưa đặt tên",
  species: toSpecies(pet.species),
  breed: pet.breed ?? "Chưa rõ giống",
  ageLabel: toAgeLabel(pet.ageDisplay, pet.age),
  gender: toGender(pet.gender),
  location: pet.rescueLocation || formatLocation(pet.ward, pet.province),
  imageUrl: pet.imageUrls?.[0] ?? "https://placehold.co/800x600?text=Pet",
  vaccinated: Boolean(pet.vaccinated),
  adult: (pet.age ?? 0) >= 12,
  favorite: false,
  badge: labelFromHealth(pet.healthStatus),
  description: pet.description || "Chưa có mô tả chi tiết.",
  shelterName: pet.organization?.name ?? pet.owner?.name ?? "Pet Rescue",
  healthBadges: buildHealthBadges(pet),
  story:
    pet.rescueDate || pet.rescueLocation
      ? `Bé được ghi nhận rescue ${pet.rescueDate ? `từ ${new Date(pet.rescueDate).toLocaleDateString("vi-VN")}` : ""}${pet.rescueLocation ? ` tại ${pet.rescueLocation}` : ""}.`
      : "Hành trình rescue của bé đang được cập nhật.",
});

const mapOwnershipToDiary = (item: PetOwnershipResponseDto, index: number): PetDiaryEntry => ({
  id: `${item.petId ?? "pet"}-${item.ownerId ?? index}-${index}`,
  title: `Chuyển chăm sóc cho ${item.ownerName ?? "người nuôi"}`,
  subtitle: item.fromTime ? new Date(item.fromTime).toLocaleDateString("vi-VN") : "Lịch sử sở hữu",
  note: `${item.ownerType ?? "OWNER"}${item.toTime ? `, kết thúc ${new Date(item.toTime).toLocaleDateString("vi-VN")}` : ", đang là người nuôi hiện tại"}.`,
  mood: "Sức khỏe",
  moodTone: "good",
  tags: [item.ownerType ?? "owner"],
});

const mapMediaToDiary = (item: MediaFileResponseDto, index: number): PetDiaryEntry => ({
  id: item.mediaId ?? `media-${index}`,
  title: "Cập nhật hình ảnh",
  subtitle: item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Ảnh đính kèm",
  note: "Ảnh thực tế được lấy từ hồ sơ media của bé.",
  imageUrl: item.url,
  mood: "Sức khỏe",
  moodTone: "warning",
  tags: [item.type?.toLowerCase() ?? "media"],
});

const buildChecklist = (pet: PetResponseDto) => [
  {
    id: `${pet.petId}-health`,
    title: "Tình trạng sức khỏe",
    detail: labelFromHealth(pet.healthStatus),
    tone: toneFromHealth(pet.healthStatus),
  },
  {
    id: `${pet.petId}-vaccine`,
    title: "Tiêm vaccine",
    detail: pet.vaccinated ? "Đã cập nhật vaccine" : "Chưa có thông tin vaccine",
    tone: pet.vaccinated ? "good" : "warning",
  },
  {
    id: `${pet.petId}-neutered`,
    title: "Triệt sản",
    detail: pet.neutered ? "Đã triệt sản" : "Chưa triệt sản hoặc chưa cập nhật",
    tone: pet.neutered ? "good" : "alert",
  },
] as const;

export const fetchAvailablePets = async ({
  filters,
  page,
  pageSize = PAGE_SIZE,
}: {
  filters: PetFilters;
  page: number;
  pageSize?: number;
}): Promise<PaginatedPets> => {
  const response = await getAvailable({
    page,
    size: pageSize,
    species: filters.species !== "all" ? filters.species.toUpperCase() : undefined,
    breed: filters.keyword.trim() || undefined,
  });

  const payload = response.data;
  const items = (payload?.content ?? []).map(mapSummaryToAdoptionPet).filter((pet) => {
    const matchesKeyword = filters.keyword
      ? [pet.name, pet.breed, pet.location, pet.shelterName]
          .join(" ")
          .toLowerCase()
          .includes(filters.keyword.toLowerCase())
      : true;
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "vaccinated" && pet.vaccinated) ||
      (filters.status === "adult" && pet.adult);
    return matchesKeyword && matchesStatus;
  });

  return {
    items,
    nextPage: payload?.last ? null : page + 1,
    total: payload?.totalElements ?? items.length,
  };
};

export const fetchPetDetail = async (id: string) => {
  const response = await getById2(id);
  if (!response.data) return null;
  return mapDetailToAdoptionPet(response.data);
};

export const fetchMyPets = async (): Promise<MyPetRecord[]> => {
  const me = await getCurrentUser();
  const userId = me.data?.userId;
  if (!userId) return [];

  const response = await getByUser(userId, { page: 0, size: 50 });
  return (response.data?.content ?? []).map((pet) => ({
    id: pet.petId ?? pet.petCode ?? `${pet.name}-${pet.imageUrl}`,
    name: pet.name ?? "Chưa đặt tên",
    species: toSpecies(pet.species) === "cat" ? "Mèo" : "Chó",
    breed: pet.breed ?? "Chưa rõ giống",
    gender: toGender(pet.gender) === "female" ? "Cái" : "Đực",
    ageLabel: toAgeLabel(pet.ageDisplay, pet.age),
    weightLabel: "Chưa cập nhật",
    color: "Chưa cập nhật",
    rescueLocation: formatLocation(pet.ward, pet.province),
    statusLabel: labelFromHealth(pet.healthStatus),
    statusTone: toneFromHealth(pet.healthStatus),
    imageUrl: pet.imageUrl ?? "https://placehold.co/800x600?text=Pet",
    shortNote: `${pet.name ?? "Bé cưng"} hiện thuộc hồ sơ của bạn.`,
    vaccineLabel: pet.vaccinated ? "Đã cập nhật" : "Chưa cập nhật",
    dewormLabel: "Chưa cập nhật",
    neuterLabel: "Chưa cập nhật",
    ownerLabel: pet.owner?.name ?? "Bạn",
    healthSummary: "Dữ liệu được lấy trực tiếp từ hồ sơ thú cưng trên hệ thống.",
    checklists: [
      {
        id: `${pet.petId}-health`,
        title: "Tình trạng sức khỏe",
        detail: labelFromHealth(pet.healthStatus),
        tone: toneFromHealth(pet.healthStatus),
      },
    ],
    diary: [],
  }));
};

export const fetchMyPetDetail = async (id: string): Promise<MyPetRecord | null> => {
  const [petResponse, mediaResponse, ownershipResponse] = await Promise.all([
    getById2(id),
    getMedia(id, { page: 0, size: 10 }).catch(() => null),
    getOwnerships(id, { page: 0, size: 10 }).catch(() => null),
  ]);

  const pet = petResponse.data;
  if (!pet) return null;

  const diary = [
    ...(mediaResponse?.data?.content ?? []).map(mapMediaToDiary),
    ...(ownershipResponse?.data?.content ?? []).map(mapOwnershipToDiary),
  ].sort((a, b) => b.subtitle.localeCompare(a.subtitle));

  return {
    id: pet.petId ?? pet.petCode ?? id,
    name: pet.name ?? "Chưa đặt tên",
    species: toSpecies(pet.species) === "cat" ? "Mèo" : "Chó",
    breed: pet.breed ?? "Chưa rõ giống",
    gender: toGender(pet.gender) === "female" ? "Cái" : "Đực",
    ageLabel: toAgeLabel(pet.ageDisplay, pet.age),
    weightLabel: typeof pet.weight === "number" ? `${pet.weight} kg` : "Chưa cập nhật",
    color: pet.color ?? "Chưa cập nhật",
    rescueLocation: pet.rescueLocation || formatLocation(pet.ward, pet.province),
    statusLabel: labelFromHealth(pet.healthStatus),
    statusTone: toneFromHealth(pet.healthStatus),
    imageUrl: pet.imageUrls?.[0] ?? "https://placehold.co/800x600?text=Pet",
    shortNote: pet.description || `${pet.name ?? "Bé cưng"} đang được theo dõi trong hệ thống.`,
    vaccineLabel: pet.vaccinated ? "Đã cập nhật" : "Chưa cập nhật",
    dewormLabel: "Chưa cập nhật",
    neuterLabel: pet.neutered ? "Đã triệt sản" : "Chưa triệt sản",
    ownerLabel: pet.owner?.name ?? "Bạn",
    healthSummary: pet.description || "Chưa có ghi chú chăm sóc chi tiết.",
    checklists: [...buildChecklist(pet)],
    diary,
  };
};

export const updateMyPet = async (id: string, payload: UpdatePetRequestDto) => {
  const response = await update2(id, payload);
  return response.data;
};

export const createMyPet = async ({
  name,
  species,
  breed,
  gender,
  weight,
  color,
  description,
}: {
  name: string;
  species: "dog" | "cat";
  breed?: string;
  gender: "male" | "female";
  weight?: number;
  color?: string;
  description?: string;
}) => {
  const response = await createAsUser({
    name,
    species: species.toUpperCase(),
    breed,
    gender:
      gender === "female"
        ? CreatePetRequestDtoGender.FEMALE
        : CreatePetRequestDtoGender.MALE,
    weight,
    color,
    description,
  });

  return response.data;
};
