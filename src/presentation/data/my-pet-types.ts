export type PetTone = "good" | "warning" | "alert";

export interface PetChecklistItem {
  id: string;
  title: string;
  detail: string;
  tone: PetTone;
}

export interface PetDiaryEntry {
  id: string;
  title: string;
  subtitle: string;
  note: string;
  imageUrl?: string;
  mood: "Tắm rửa" | "Ăn uống" | "Sức khỏe";
  moodTone: PetTone;
  tags: string[];
}

export interface MyPetRecord {
  id: string;
  name: string;
  species: "Chó" | "Mèo";
  breed: string;
  gender: "Đực" | "Cái";
  ageLabel: string;
  weightLabel: string;
  color: string;
  rescueLocation: string;
  statusLabel: string;
  statusTone: PetTone;
  imageUrl: string;
  shortNote: string;
  vaccineLabel: string;
  dewormLabel: string;
  neuterLabel: string;
  ownerLabel: string;
  healthSummary: string;
  checklists: PetChecklistItem[];
  diary: PetDiaryEntry[];
}
