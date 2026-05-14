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

export const MY_PETS: MyPetRecord[] = [
  {
    id: "ca-phe",
    name: "Cà Phê",
    species: "Chó",
    breed: "Poodle lai",
    gender: "Cái",
    ageLabel: "2 tuổi",
    weightLabel: "7.8 kg",
    color: "Vàng kem",
    rescueLocation: "Quận 3, TP.HCM",
    statusLabel: "Mới hoàn tất",
    statusTone: "good",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    shortNote: "Khỏe mạnh, ăn uống tốt và đang thích nghi rất nhanh với gia đình.",
    vaccineLabel: "Đã tiêm 3 mũi",
    dewormLabel: "Uống định kỳ",
    neuterLabel: "Đã triệt sản",
    ownerLabel: "Nguyễn Văn An",
    healthSummary: "Hiện sức khỏe ổn định, năng lượng tốt và không có dấu hiệu bất thường.",
    checklists: [
      {
        id: "ca-phe-1",
        title: "Khám tổng quát",
        detail: "Đã hoàn thành tại phòng khám quận 3",
        tone: "good",
      },
      {
        id: "ca-phe-2",
        title: "Tiêm vaccine dại",
        detail: "Lần gần nhất: 10/04/2026",
        tone: "warning",
      },
      {
        id: "ca-phe-3",
        title: "Cập nhật cân nặng",
        detail: "Cần kiểm tra lại trong 2 tuần tới",
        tone: "alert",
      },
    ],
    diary: [
      {
        id: "ca-phe-d1",
        title: "Tắm xong",
        subtitle: "Hôm nay - 08:30",
        note: "Cà Phê rất hợp tác khi tắm và sấy lông, không còn run như tuần trước.",
        imageUrl:
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
        mood: "Tắm rửa",
        moodTone: "warning",
        tags: ["Tắm", "Lông sạch", "Ổn định"],
      },
      {
        id: "ca-phe-d2",
        title: "Ăn tốt",
        subtitle: "Hôm qua - 18:15",
        note: "Ăn hết khẩu phần tối và uống nước đều, tinh thần vui vẻ hơn nhiều.",
        mood: "Ăn uống",
        moodTone: "good",
        tags: ["Ăn đủ", "Vui vẻ"],
      },
      {
        id: "ca-phe-d3",
        title: "Theo dõi sức khỏe",
        subtitle: "3 ngày trước",
        note: "Không còn ho nhẹ, nhịp thở ổn định. Tiếp tục theo dõi khi vận động ngoài trời.",
        imageUrl:
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
        mood: "Sức khỏe",
        moodTone: "alert",
        tags: ["Theo dõi", "Hồi phục"],
      },
    ],
  },
  {
    id: "ti-sua",
    name: "Tí Sữa",
    species: "Mèo",
    breed: "Mèo Anh lông ngắn lai",
    gender: "Đực",
    ageLabel: "11 tháng",
    weightLabel: "4.1 kg",
    color: "Xám trắng",
    rescueLocation: "Thủ Đức, TP.HCM",
    statusLabel: "Mới hoàn tất",
    statusTone: "good",
    imageUrl:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
    shortNote: "Hiền, thích nằm gần cửa sổ và đã quen lịch ăn mới của gia đình.",
    vaccineLabel: "Đã tiêm đủ",
    dewormLabel: "Đã tẩy giun",
    neuterLabel: "Chưa triệt sản",
    ownerLabel: "Nguyễn Văn An",
    healthSummary: "Tí Sữa đang duy trì cân nặng tốt, tiêu hóa ổn định và ngủ đều giấc.",
    checklists: [
      {
        id: "ti-sua-1",
        title: "Vệ sinh tai",
        detail: "Cần làm lại vào cuối tuần",
        tone: "warning",
      },
      {
        id: "ti-sua-2",
        title: "Lịch triệt sản",
        detail: "Đang chờ xác nhận từ phòng khám",
        tone: "alert",
      },
      {
        id: "ti-sua-3",
        title: "Kiểm tra răng miệng",
        detail: "Bình thường, chưa phát hiện viêm lợi",
        tone: "good",
      },
    ],
    diary: [
      {
        id: "ti-sua-d1",
        title: "Ngủ ngon",
        subtitle: "Hôm nay - 13:20",
        note: "Bé ngủ liền mạch sau khi chơi đùa khoảng 20 phút với bóng len.",
        mood: "Sức khỏe",
        moodTone: "good",
        tags: ["Ngủ sâu", "Dễ chịu"],
      },
      {
        id: "ti-sua-d2",
        title: "Ăn ít hơn mọi ngày",
        subtitle: "2 ngày trước",
        note: "Có dấu hiệu ăn chậm hơn vào buổi tối, tạm thời tiếp tục theo dõi thêm.",
        imageUrl:
          "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
        mood: "Ăn uống",
        moodTone: "warning",
        tags: ["Theo dõi", "Ăn chậm"],
      },
    ],
  },
];

export const findMyPetById = (id: string) => MY_PETS.find((pet) => pet.id === id);
