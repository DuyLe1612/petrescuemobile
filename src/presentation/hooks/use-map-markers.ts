import { container } from "@/src/infrastructure/di";
import type {
    MapBounds,
    MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export const useMapMarkers = (params: {
  source: MapSourceKey;
  bounds?: MapBounds;
  organizationTypes?: string[];
}) => {
  const [debounced, setDebounced] = useState(params);

  useEffect(() => {
    // debounce param changes to avoid rapid API calls (e.g., when user pans map)
    const t = setTimeout(
      () =>
        setDebounced({
          source: params.source,
          bounds: params.bounds,
          organizationTypes: params.organizationTypes,
        }),
      500,
    );
    return () => clearTimeout(t);
  }, [params.source, params.bounds, params.organizationTypes]);

  const queryKey = useMemo(
    () => ["map-markers", debounced.source, debounced.bounds],
    [debounced],
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      return container.map.getMapMarkersUseCase.execute({
        source: debounced.source,
        bounds: debounced.bounds,
        organizationTypes: debounced.organizationTypes,
      });
    },
    // keep previous data while fetching updated results
  });
};
