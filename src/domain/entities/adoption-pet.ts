export type PetSpecies = "all" | "dog" | "cat" | "bird" | "rabbit";

export type PetFilterStatus = "all" | "vaccinated" | "adult";

export type PetGender = "male" | "female";

export interface AdoptionPet {
  id: string;
  name: string;
  species: Exclude<PetSpecies, "all">;
  breed: string;
  ageLabel: string;
  gender: PetGender;
  location: string;
  imageUrl: string;
  vaccinated: boolean;
  adult: boolean;
  favorite: boolean;
  badge: string;
  description: string;
  shelterName: string;
  healthBadges: string[];
  story: string;
}

export interface PetFilters {
  keyword: string;
  species: PetSpecies;
  status: PetFilterStatus;
}

export interface PaginatedPets {
  items: AdoptionPet[];
  nextPage: number | null;
  total: number;
}
