import { container } from "@/src/infrastructure/di";
import type {
    MapBounds,
    MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export const useMapMarkers = (params: {
  source: MapSourceKey | "all";
  bounds?: MapBounds;
}) => {
  const [debounced, setDebounced] = useState(params);

  useEffect(() => {
    // debounce param changes to avoid rapid API calls (e.g., when user pans map)
    const t = setTimeout(() => setDebounced(params), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.source, JSON.stringify(params.bounds ?? {})]);

  const queryKey = useMemo(
    () => ["map-markers", debounced.source, debounced.bounds],
    [debounced],
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (debounced.source === "all") {
        const [r1, r2] = await Promise.all([
          container.map.getMapMarkersUseCase.execute({
            source: "rescue",
            bounds: debounced.bounds,
          }),
          container.map.getMapMarkersUseCase.execute({
            source: "organization",
            bounds: debounced.bounds,
          }),
        ]);
        return [...r1, ...r2];
      }

      return container.map.getMapMarkersUseCase.execute({
        source: debounced.source as MapSourceKey,
        bounds: debounced.bounds,
      });
    },
    // keep previous data while fetching updated results
  });
};
