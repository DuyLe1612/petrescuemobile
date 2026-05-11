import { AdoptionSummary } from "@/src/domain/entities/adoption";
import { container } from "@/src/infrastructure/di";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AdoptionFilter = "all" | AdoptionSummary["status"];

export const useMyAdoptions = () => {
  const [data, setData] = useState<AdoptionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const items = await container.adoption.getMyAdoptionsUseCase.execute({
        page: 0,
        size: 20,
      });
      setData(items);
    } catch {
      setError("Không thể tải danh sách hồ sơ. Vui lòng thử lại.");
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const counts = useMemo(() => {
    return {
      all: data.length,
      PENDING: data.filter((item) => item.status === "PENDING").length,
      APPROVED: data.filter((item) => item.status === "APPROVED").length,
      REJECTED: data.filter((item) => item.status === "REJECTED").length,
      CANCELLED: data.filter((item) => item.status === "CANCELLED").length,
    };
  }, [data]);

  return {
    data,
    loading,
    refreshing,
    error,
    counts,
    refresh,
  };
};
