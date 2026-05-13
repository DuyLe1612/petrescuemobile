import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { PetFilters } from "@/src/domain/entities/adoption-pet";
import { fetchMockAdoptionPets } from "@/src/infrastructure/mocks/adoption-pets";

const PAGE_SIZE = 6;

export const useAdoptionPets = (filters: PetFilters) => {
  const query = useInfiniteQuery({
    queryKey: ["adoption-pets", filters],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchMockAdoptionPets({
        filters,
        page: pageParam,
        pageSize: PAGE_SIZE,
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 30_000,
  });

  const pets = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.items) ?? [];
  }, [query.data]);

  const total = query.data?.pages[0]?.total ?? 0;

  return {
    ...query,
    pets,
    total,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
  };
};
