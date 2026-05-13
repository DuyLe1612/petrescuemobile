import {
  PetFilterStatus,
  PetFilters,
  PetSpecies,
} from "@/src/domain/entities/adoption-pet";
import { useCallback, useMemo, useState } from "react";

export const DEFAULT_PET_FILTERS: PetFilters = {
  keyword: "",
  species: "all",
  status: "all",
};

export const usePetFilters = () => {
  const [filters, setFilters] = useState<PetFilters>(DEFAULT_PET_FILTERS);

  const setKeyword = useCallback((keyword: string) => {
    setFilters((current) => ({ ...current, keyword }));
  }, []);

  const setSpecies = useCallback((species: PetSpecies) => {
    setFilters((current) => ({ ...current, species }));
  }, []);

  const setStatus = useCallback((status: PetFilterStatus) => {
    setFilters((current) => ({ ...current, status }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_PET_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.keyword.trim().length > 0 ||
      filters.species !== DEFAULT_PET_FILTERS.species ||
      filters.status !== DEFAULT_PET_FILTERS.status
    );
  }, [filters]);

  return {
    filters,
    hasActiveFilters,
    setKeyword,
    setSpecies,
    setStatus,
    resetFilters,
  };
};
