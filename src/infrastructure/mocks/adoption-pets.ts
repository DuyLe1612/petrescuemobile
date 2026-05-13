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
    favorite: false,
    badge: "Đã tiêm phòng",
    description: "Hiền, thích chơi bóng và rất quấn người.",
    shelterName: "Trạm Cứu Hộ Sài Gòn",
    healthBadges: ["Đã tiêm phòng", "Tẩy giun", "Ăn tốt"],
    story:
      "Bim được cứu từ một bãi đất trống và đang hồi phục rất tốt trong môi trường nuôi tạm.",
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
    favorite: true,
    badge: "Trưởng thành",
    description: "Điềm tĩnh, quen ở nhà và sạch sẽ.",
    shelterName: "Cat House Thủ Đức",
    healthBadges: ["Đã tiêm phòng", "Triệt sản", "Đi vệ sinh đúng chỗ"],
    story:
      "Milu hợp với người cần một bé mèo ổn định và ít quậy, có thể ở căn hộ nhỏ.",
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
    favorite: false,
    badge: "Cần gặp trực tiếp",
    description: "Năng động, hợp gia đình có sân nhỏ.",
    shelterName: "Paws Đồng Nai",
    healthBadges: ["Đã kiểm tra sức khỏe", "Thích vận động"],
    story:
      "Nâu cần một gia đình có thời gian cho vận động và huấn luyện thêm.",
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
    favorite: false,
    badge: "Thân thiện",
    description: "Dạn người, đã ăn hạt ổn định.",
    shelterName: "Bird Corner Quận 7",
    healthBadges: ["Ăn độc lập", "Dạn người"],
    story:
      "Mít được chăm trong môi trường yên tĩnh và phản ứng tốt với người lạ.",
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
    favorite: false,
    badge: "Ở trong nhà tốt",
    description: "Yên tĩnh, quen dùng khay vệ sinh.",
    shelterName: "Rabbit Home Bình Dương",
    healthBadges: ["Đã tiêm phòng", "Quen khay vệ sinh"],
    story:
      "Cà Rốt có nhịp sinh hoạt đều và phù hợp người muốn nuôi thỏ trong nhà.",
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
    favorite: false,
    badge: "Bé nhỏ",
    description: "Hoạt bát, hợp nhà có người chơi cùng.",
    shelterName: "Nha Trang Pet Foster",
    healthBadges: ["Đã tiêm phòng", "Bé nhỏ", "Ăn hạt tốt"],
    story: "Lu rất quấn người và phản ứng tốt với việc huấn luyện cơ bản.",
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
    favorite: true,
    badge: "Đã tiêm phòng",
    description: "Tinh nghịch, quen với chó nhỏ.",
    shelterName: "Mèo Cầu Giấy",
    healthBadges: ["Đã tiêm phòng", "Hoà đồng"],
    story:
      "Bơ được nuôi ghép cùng chó nhỏ nên thích nghi tốt với gia đình có nhiều thú cưng.",
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
    favorite: false,
    badge: "Trưởng thành",
    description: "Điềm đạm, thích không gian yên tĩnh.",
    shelterName: "Cat Station Hà Nội",
    healthBadges: ["Đã tiêm phòng", "Triệt sản", "Ít stress"],
    story:
      "Gừng cần không gian yên và chủ nuôi nhẹ nhàng để gắn kết lâu dài.",
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
    favorite: false,
    badge: "Rất thân thiện",
    description: "Hợp gia đình có trẻ nhỏ.",
    shelterName: "Đà Nẵng Dog Rescue",
    healthBadges: ["Đã tiêm phòng", "Hoà đồng", "Đi dạo tốt"],
    story: "Khoai luôn chủ động lại gần người và học lệnh cơ bản nhanh.",
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
    favorite: false,
    badge: "Biết huýt sáo",
    description: "Dễ làm quen, thích giao tiếp.",
    shelterName: "Feather House Huế",
    healthBadges: ["Ăn tốt", "Dạn người"],
    story:
      "Pi phù hợp người muốn bắt đầu nuôi chim cảnh trong không gian nhỏ.",
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
    favorite: false,
    badge: "Siêu ngoan",
    description: "Ăn rau tốt, quen được vuốt ve.",
    shelterName: "Rabbit Foster Đà Nẵng",
    healthBadges: ["Ăn tốt", "Hiền"],
    story:
      "Mochi còn nhỏ nhưng đã ổn định và thích được tương tác nhẹ nhàng.",
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
    favorite: true,
    badge: "Cần nhà ổn định",
    description: "Quen sống căn hộ, rất nghe lời.",
    shelterName: "Foster Quận 3",
    healthBadges: ["Đã tiêm phòng", "Ở căn hộ tốt", "Nghe lời"],
    story:
      "Sumi hợp người cần một bé chó đã trưởng thành và nề nếp hơn chó con.",
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
    favorite: false,
    badge: "Bám người",
    description: "Thích ngủ cạnh người và dễ chăm.",
    shelterName: "Mèo Tân Bình",
    healthBadges: ["Đã tiêm phòng", "Dễ chăm"],
    story:
      "Cốm có xu hướng tìm người để dựa và rất hợp cuộc sống trong nhà.",
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
    favorite: false,
    badge: "Năng lượng cao",
    description: "Cần chủ thích vận động ngoài trời.",
    shelterName: "Dog Shelter Quận 10",
    healthBadges: ["Khám tổng quát", "Năng lượng cao"],
    story:
      "Bean cần lịch sinh hoạt đều và nhiều hoạt động ngoài trời để cân bằng năng lượng.",
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
    favorite: true,
    badge: "Thông minh",
    description: "Phản hồi tên tốt, hợp người mới nuôi mèo.",
    shelterName: "Meow Long Biên",
    healthBadges: ["Đã tiêm phòng", "Triệt sản", "Thông minh"],
    story:
      "Nori là bé mèo dễ giao tiếp và có thể thích nghi nhanh với nhà mới.",
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
    favorite: false,
    badge: "Màu đẹp",
    description: "Thích đồ chơi treo lồng.",
    shelterName: "Bird Corner Phú Nhuận",
    healthBadges: ["Dạn người", "Hiếu động"],
    story:
      "Rio hoạt bát, phù hợp người dành thời gian nói chuyện và chơi cùng mỗi ngày.",
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
    favorite: false,
    badge: "Lông xù",
    description: "Cần chải lông định kỳ, rất hiền.",
    shelterName: "Rabbit Care Buôn Ma Thuột",
    healthBadges: ["Đã tiêm phòng", "Hiền", "Quen chải lông"],
    story:
      "Mây ổn định với người lạ và chịu hợp tác tốt khi chăm sóc lông.",
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
    favorite: false,
    badge: "Bé nhỏ",
    description: "Phù hợp nhà ít không gian.",
    shelterName: "Foster Quận 5",
    healthBadges: ["Bé nhỏ", "Khám tổng quát"],
    story:
      "Tí phù hợp người mới nuôi chó vì kích thước nhỏ và dễ quản lý.",
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
    favorite: true,
    badge: "Quý phái",
    description: "Thích góc nắng và ít ồn ào.",
    shelterName: "Vũng Tàu Cat Rescue",
    healthBadges: ["Đã tiêm phòng", "Triệt sản", "Điềm tĩnh"],
    story:
      "Luna cần môi trường ổn định để phát huy tính cách dịu và bám chủ.",
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
    favorite: false,
    badge: "Biết bắt chước",
    description: "Ăn hạt và trái cây đều tốt.",
    shelterName: "Cần Thơ Bird Care",
    healthBadges: ["Ăn tốt", "Hoạt bát"],
    story:
      "Coco phản ứng nhanh với giọng người và rất tò mò với đồ chơi mới.",
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
    favorite: false,
    badge: "Rất hợp trẻ em",
    description: "Đi dạo tốt, không kéo dây mạnh.",
    shelterName: "Trạm Cứu Hộ Thủ Đức",
    healthBadges: ["Đã tiêm phòng", "Đi dạo tốt", "Hoà đồng"],
    story:
      "Đậu là lựa chọn an toàn cho gia đình cần một bé chó thân thiện và ổn định.",
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
    favorite: false,
    badge: "Mới cứu hộ",
    description: "Cần gia đình kiên nhẫn giai đoạn đầu.",
    shelterName: "Foster Gò Vấp",
    healthBadges: ["Khám tổng quát", "Cần làm quen"],
    story:
      "Mơ mới vào trạm nên cần thêm thời gian để tự tin và gắn bó với người mới.",
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
    favorite: false,
    badge: "Lông mượt",
    description: "Ăn tốt, phù hợp nuôi trong nhà.",
    shelterName: "Rabbit Sơn Trà",
    healthBadges: ["Đã tiêm phòng", "Ăn tốt"],
    story:
      "Pika có thói quen sinh hoạt đều và dễ thích nghi với không gian căn hộ.",
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
    favorite: true,
    badge: "Ở căn hộ tốt",
    description: "Điềm tĩnh, quen sinh hoạt trong nhà.",
    shelterName: "Pet Foster Quận 2",
    healthBadges: ["Đã tiêm phòng", "Ở căn hộ tốt", "Ít sủa"],
    story:
      "Sunny quen nếp sinh hoạt trong nhà và phù hợp người cần một bé chó ổn định.",
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
      const items = filtered.slice(start, end).map((pet) => ({ ...pet }));

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

export const fetchMockPetById = ({
  id,
  signal,
}: {
  id: string;
  signal?: AbortSignal;
}): Promise<AdoptionPet> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      const pet = MOCK_PETS.find((item) => item.id === id);

      if (!pet) {
        reject(new Error("Không tìm thấy thú cưng này."));
        return;
      }

      resolve({ ...pet });
    }, 450);

    const abortHandler = () => {
      clearTimeout(timeoutId);
      reject(createAbortError());
    };

    signal?.addEventListener("abort", abortHandler, { once: true });
  });
};

export const toggleMockFavoritePet = ({
  id,
  nextFavorite,
}: {
  id: string;
  nextFavorite: boolean;
}) => {
  return new Promise<AdoptionPet>((resolve, reject) => {
    setTimeout(() => {
      const petIndex = MOCK_PETS.findIndex((item) => item.id === id);

      if (petIndex === -1) {
        reject(new Error("Không tìm thấy thú cưng để cập nhật."));
        return;
      }

      if (id === "pet-22") {
        reject(new Error("Không thể cập nhật yêu thích lúc này. Vui lòng thử lại."));
        return;
      }

      MOCK_PETS[petIndex] = {
        ...MOCK_PETS[petIndex],
        favorite: nextFavorite,
      };

      resolve({ ...MOCK_PETS[petIndex] });
    }, 280);
  });
};
