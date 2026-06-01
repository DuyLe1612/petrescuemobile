import { queryClient } from "@/app/_layout";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { EmptyState } from "@/src/presentation/components/adoption/EmptyState";
import { ErrorState } from "@/src/presentation/components/adoption/ErrorState";
import { PetListItem, PET_CARD_HEIGHT } from "@/src/presentation/components/adoption/PetListItem";
import { SearchBar } from "@/src/presentation/components/adoption/SearchBar";
import { SkeletonLoading } from "@/src/presentation/components/adoption/SkeletonLoading";
import { useAdoptionPets } from "@/src/presentation/hooks/use-adoption-pets";
import { useDebounce } from "@/src/presentation/hooks/use-debounce";
import { usePetFilters } from "@/src/presentation/hooks/use-pet-filters";

const HORIZONTAL_PADDING = 16;
const GRID_GAP = 16;

const getColumnCount = (width: number) => {
  if (width >= 900) return 3;
  if (width >= 520) return 2;
  return 1;
};

export default function AdoptionScreen() {
  const { width } = useWindowDimensions();
  const columnCount = getColumnCount(width);
  const cardWidth = useMemo(() => {
    const innerWidth = width - HORIZONTAL_PADDING * 2;
    const totalGap = GRID_GAP * (columnCount - 1);
    return (innerWidth - totalGap) / columnCount;
  }, [columnCount, width]);

  const [page, setPage] = useState(0);

  const { filters, hasActiveFilters, resetFilters, setKeyword, setSpecies, setStatus } =
    usePetFilters();
  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const queryFilters = useMemo(
    () => ({
      ...filters,
      keyword: debouncedKeyword,
    }),
    [debouncedKeyword, filters]
  );

  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword]);

  const {
    pets,
    total,
    error,
    hasNextPage,
    isLoading,
    isRefreshing,
    refetch,
  } = useAdoptionPets(queryFilters, page);

  const listHeader = (
    <View className="px-4 pb-4 pt-4">
      <SearchBar
        value={filters.keyword}
        onChangeText={setKeyword}
        onClear={() => setKeyword("")}
      />

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-muted-foreground">
          {isLoading ? "Đang tìm thú cưng..." : `${total} bé đang chờ nhận nuôi`}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          accessibilityRole="button"
          accessibilityLabel="Làm mới danh sách thú cưng"
          className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2"
        >
          <Feather name="refresh-cw" size={14} color="#277f8f" />
          <Text className="text-xs font-semibold text-primary">Làm mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalPages = Math.ceil(total / 6);
  const paginationFooter = (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 18, paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page === 0}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: page === 0 ? "rgba(0,0,0,0.04)" : "#0a4c73",
        }}
      >
        <Text style={{ color: page === 0 ? "#bbb" : "white", fontSize: 13, fontWeight: "700" }}>Trang trước</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 13, fontWeight: "700", color: "#333" }}>
        Trang {page + 1} / {Math.max(1, totalPages)}
      </Text>

      <TouchableOpacity
        onPress={() => setPage((p) => (hasNextPage ? p + 1 : p))}
        disabled={!hasNextPage}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: !hasNextPage ? "rgba(0,0,0,0.04)" : "#0a4c73",
        }}
      >
        <Text style={{ color: !hasNextPage ? "#bbb" : "white", fontSize: 13, fontWeight: "700" }}>Trang sau</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        {listHeader}
        <SkeletonLoading cardWidth={cardWidth} count={columnCount * 4} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={pets}
        key={columnCount}
        keyExtractor={(item) => item.id}
        numColumns={columnCount}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          error ? (
            <ErrorState
              message={error instanceof Error ? error.message : "Không thể tải danh sách thú cưng."}
              onRetry={() => refetch()}
            />
          ) : (
            <EmptyState onClearFilters={resetFilters} />
          )
        }
        renderItem={({ item }) => (
          <PetListItem
            pet={item}
            width={cardWidth}
            onPress={() => {
              queryClient.setQueryData(["pet-detail", item.id], item);
              router.push({
                pathname: "/pet/[id]",
                params: { id: item.id },
              });
            }}
          />
        )}
        columnWrapperStyle={
          columnCount > 1 ? { gap: GRID_GAP, paddingHorizontal: HORIZONTAL_PADDING } : undefined
        }
        contentContainerStyle={{
          paddingBottom: 120,
          gap: GRID_GAP,
          paddingHorizontal: columnCount === 1 ? HORIZONTAL_PADDING : 0,
        }}
        ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        getItemLayout={(_, index) => {
          const row = Math.floor(index / columnCount);
          const offset = row * (PET_CARD_HEIGHT + GRID_GAP);
          return {
            length: PET_CARD_HEIGHT + GRID_GAP,
            offset,
            index,
          };
        }}
        onScrollBeginDrag={Keyboard.dismiss}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListFooterComponent={
          pets.length > 0 ? paginationFooter : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
