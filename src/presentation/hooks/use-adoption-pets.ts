import { useQuery } from "@tanstack/react-query";

import { PetFilters } from "@/src/domain/entities/adoption-pet";
import { fetchAvailablePets } from "@/src/presentation/data/pet-api";

const PAGE_SIZE = 6;

export const useAdoptionPets = (filters: PetFilters, page: number) => {
  const query = useQuery({
    queryKey: ["adoption-pets", filters, page],
    queryFn: () =>
      fetchAvailablePets({
        filters,
        page,
        pageSize: PAGE_SIZE,
      }),
    staleTime: 30_000,
  });

  const pets = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const hasNextPage = query.data?.nextPage !== null;

  return {
    ...query,
    pets,
    total,
    hasNextPage,
    isRefreshing: query.isRefetching,
  };
};
