import {
  AdoptionPet,
  PaginatedPets,
  PetFilters,
} from "@/src/domain/entities/adoption-pet";

const MOCK_PETS: AdoptionPet[] = [
  {
    id: "pet-01",
    name: "Bim",
    species: "dog",
    breed: "Corgi lai",
    ageLabel: "8 tháng",
    gender: "male",
    location: "Quận 1, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: false,
    badge: "Đã tiêm phòng",
    description: "Hiền, thích chơi bóng và rất quấn người.",
  },
  {
    id: "pet-02",
    name: "Milu",
    species: "cat",
    breed: "Mèo tam thể",
    ageLabel: "2 tuổi",
    gender: "female",
    location: "Thủ Đức, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Trưởng thành",
    description: "Điềm tĩnh, quen ở nhà và sạch sẽ.",
  },
  {
    id: "pet-03",
    name: "Nâu",
    species: "dog",
    breed: "Shiba lai",
    ageLabel: "1 tuổi",
    gender: "female",
    location: "Biên Hòa, Đồng Nai",
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: true,
    badge: "Cần gặp trực tiếp",
    description: "Năng động, hợp gia đình có sân nhỏ.",
  },
  {
    id: "pet-04",
    name: "Mít",
    species: "bird",
    breed: "Vẹt yến phụng",
    ageLabel: "10 tháng",
    gender: "male",
    location: "Quận 7, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: false,
    badge: "Thân thiện",
    description: "Dạn người, đã ăn hạt ổn định.",
  },
  {
    id: "pet-05",
    name: "Cà Rốt",
    species: "rabbit",
    breed: "Thỏ tai cụp",
    ageLabel: "1.5 tuổi",
    gender: "female",
    location: "Dĩ An, Bình Dương",
    imageUrl:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Ở trong nhà tốt",
    description: "Yên tĩnh, quen dùng khay vệ sinh.",
  },
  {
    id: "pet-06",
    name: "Lu",
    species: "dog",
    breed: "Poodle",
    ageLabel: "4 tháng",
    gender: "male",
    location: "Nha Trang, Khánh Hòa",
    imageUrl:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: false,
    badge: "Bé nhỏ",
    description: "Hoạt bát, hợp nhà có người chơi cùng.",
  },
  {
    id: "pet-07",
    name: "Bơ",
    species: "cat",
    breed: "Mèo mướp",
    ageLabel: "7 tháng",
    gender: "male",
    location: "Cầu Giấy, Hà Nội",
    imageUrl:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: false,
    badge: "Đã tiêm phòng",
    description: "Tinh nghịch, quen với chó nhỏ.",
  },
  {
    id: "pet-08",
    name: "Gừng",
    species: "cat",
    breed: "Mèo Anh lông ngắn lai",
    ageLabel: "3 tuổi",
    gender: "female",
    location: "Ba Đình, Hà Nội",
    imageUrl:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Trưởng thành",
    description: "Điềm đạm, thích không gian yên tĩnh.",
  },
  {
    id: "pet-09",
    name: "Khoai",
    species: "dog",
    breed: "Golden lai",
    ageLabel: "2 tuổi",
    gender: "male",
    location: "Đà Nẵng",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Rất thân thiện",
    description: "Hợp gia đình có trẻ nhỏ.",
  },
  {
    id: "pet-10",
    name: "Pi",
    species: "bird",
    breed: "Chim cockatiel",
    ageLabel: "1 tuổi",
    gender: "female",
    location: "Huế",
    imageUrl:
      "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: true,
    badge: "Biết huýt sáo",
    description: "Dễ làm quen, thích giao tiếp.",
  },
  {
    id: "pet-11",
    name: "Mochi",
    species: "rabbit",
    breed: "Thỏ trắng",
    ageLabel: "6 tháng",
    gender: "female",
    location: "Hải Châu, Đà Nẵng",
    imageUrl:
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: false,
    badge: "Siêu ngoan",
    description: "Ăn rau tốt, quen được vuốt ve.",
  },
  {
    id: "pet-12",
    name: "Sumi",
    species: "dog",
    breed: "Phốc sóc",
    ageLabel: "5 tuổi",
    gender: "female",
    location: "Quận 3, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Cần nhà ổn định",
    description: "Quen sống căn hộ, rất nghe lời.",
  },
  {
    id: "pet-13",
    name: "Cốm",
    species: "cat",
    breed: "Mèo mun",
    ageLabel: "11 tháng",
    gender: "male",
    location: "Tân Bình, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: false,
    badge: "Bám người",
    description: "Thích ngủ cạnh người và dễ chăm.",
  },
  {
    id: "pet-14",
    name: "Bean",
    species: "dog",
    breed: "Beagle lai",
    ageLabel: "1.5 tuổi",
    gender: "male",
    location: "Quận 10, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: true,
    badge: "Năng lượng cao",
    description: "Cần chủ thích vận động ngoài trời.",
  },
  {
    id: "pet-15",
    name: "Nori",
    species: "cat",
    breed: "Mèo Xiêm lai",
    ageLabel: "2 tuổi",
    gender: "female",
    location: "Long Biên, Hà Nội",
    imageUrl:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Thông minh",
    description: "Phản hồi tên tốt, hợp người mới nuôi mèo.",
  },
  {
    id: "pet-16",
    name: "Rio",
    species: "bird",
    breed: "Chim lovebird",
    ageLabel: "9 tháng",
    gender: "male",
    location: "Phú Nhuận, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1501706362039-c6b2a5cf0db9?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: false,
    badge: "Màu đẹp",
    description: "Thích đồ chơi treo lồng.",
  },
  {
    id: "pet-17",
    name: "Mây",
    species: "rabbit",
    breed: "Lionhead",
    ageLabel: "2 tuổi",
    gender: "female",
    location: "Buôn Ma Thuột",
    imageUrl:
      "https://images.unsplash.com/photo-1619521757579-37f4f71b2ca4?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Lông xù",
    description: "Cần chải lông định kỳ, rất hiền.",
  },
  {
    id: "pet-18",
    name: "Tí",
    species: "dog",
    breed: "Chihuahua lai",
    ageLabel: "3 tháng",
    gender: "male",
    location: "Quận 5, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: false,
    badge: "Bé nhỏ",
    description: "Phù hợp nhà ít không gian.",
  },
  {
    id: "pet-19",
    name: "Luna",
    species: "cat",
    breed: "Mèo trắng",
    ageLabel: "4 tuổi",
    gender: "female",
    location: "Vũng Tàu",
    imageUrl:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Quý phái",
    description: "Thích góc nắng và ít ồn ào.",
  },
  {
    id: "pet-20",
    name: "Coco",
    species: "bird",
    breed: "Vẹt đuôi dài",
    ageLabel: "2 tuổi",
    gender: "female",
    location: "Ninh Kiều, Cần Thơ",
    imageUrl:
      "https://images.unsplash.com/photo-1544923408-75c5cef46f14?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: true,
    badge: "Biết bắt chước",
    description: "Ăn hạt và trái cây đều tốt.",
  },
  {
    id: "pet-21",
    name: "Đậu",
    species: "dog",
    breed: "Labrador lai",
    ageLabel: "2.5 tuổi",
    gender: "male",
    location: "Thủ Đức, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Rất hợp trẻ em",
    description: "Đi dạo tốt, không kéo dây mạnh.",
  },
  {
    id: "pet-22",
    name: "Mơ",
    species: "cat",
    breed: "Mèo vàng",
    ageLabel: "5 tháng",
    gender: "female",
    location: "Gò Vấp, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=1200&q=80",
    vaccinated: false,
    adult: false,
    badge: "Mới cứu hộ",
    description: "Cần gia đình kiên nhẫn giai đoạn đầu.",
  },
  {
    id: "pet-23",
    name: "Pika",
    species: "rabbit",
    breed: "Mini rex",
    ageLabel: "1 tuổi",
    gender: "male",
    location: "Sơn Trà, Đà Nẵng",
    imageUrl:
      "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Lông mượt",
    description: "Ăn tốt, phù hợp nuôi trong nhà.",
  },
  {
    id: "pet-24",
    name: "Sunny",
    species: "dog",
    breed: "Pug",
    ageLabel: "3 tuổi",
    gender: "female",
    location: "Quận 2, TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=1200&q=80",
    vaccinated: true,
    adult: true,
    badge: "Ở căn hộ tốt",
    description: "Điềm tĩnh, quen sinh hoạt trong nhà.",
  },
];

const NETWORK_DELAY_MS = 650;

const createAbortError = () => {
  const error = new Error("The user aborted a request.");
  error.name = "AbortError";
  return error;
};

const matchesFilters = (pet: AdoptionPet, filters: PetFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();
  const matchesKeyword =
    keyword.length === 0 ||
    [pet.name, pet.breed, pet.location, pet.description]
      .join(" ")
      .toLowerCase()
      .includes(keyword);

  const matchesSpecies =
    filters.species === "all" || pet.species === filters.species;

  const matchesStatus =
    filters.status === "all" ||
    (filters.status === "vaccinated" && pet.vaccinated) ||
    (filters.status === "adult" && pet.adult);

  return matchesKeyword && matchesSpecies && matchesStatus;
};

export const fetchMockAdoptionPets = ({
  filters,
  page,
  pageSize,
  signal,
}: {
  filters: PetFilters;
  page: number;
  pageSize: number;
  signal?: AbortSignal;
}): Promise<PaginatedPets> => {
  if (filters.keyword.trim().toLowerCase() === "error") {
    return Promise.reject(
      new Error("Không thể tải dữ liệu mock. Vui lòng thử lại.")
    );
  }

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      const filtered = MOCK_PETS.filter((pet) => matchesFilters(pet, filters));
      const start = page * pageSize;
      const end = start + pageSize;
      const items = filtered.slice(start, end);

      resolve({
        items,
        nextPage: end < filtered.length ? page + 1 : null,
        total: filtered.length,
      });
    }, NETWORK_DELAY_MS);

    const abortHandler = () => {
      clearTimeout(timeoutId);
      reject(createAbortError());
    };

    signal?.addEventListener("abort", abortHandler, { once: true });
  });
};
