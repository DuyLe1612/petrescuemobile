import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
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

import { PetListItem, PET_CARD_HEIGHT } from "@/src/presentation/components/adoption/PetListItem";
import { CategoryList } from "@/src/presentation/components/adoption/CategoryList";
import { EmptyState } from "@/src/presentation/components/adoption/EmptyState";
import { ErrorState } from "@/src/presentation/components/adoption/ErrorState";
import { FilterChips } from "@/src/presentation/components/adoption/FilterChips";
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

  const {
    pets,
    total,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefreshing,
    refetch,
  } = useAdoptionPets(queryFilters);

  const listHeader = (
    <View className="px-4 pb-6 pt-4">
      <View className="rounded-[32px] bg-primary px-5 py-6">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-[26px] font-extrabold leading-8 text-primary-foreground">
              Tìm một người bạn mới
            </Text>
            <Text className="mt-2 text-sm leading-6 text-primary-foreground/85">
              Duyệt thú cưng đang chờ nhận nuôi với bộ lọc nhanh, cuộn mượt và dữ liệu mock phân trang.
            </Text>
          </View>
          {hasActiveFilters ? (
            <TouchableOpacity
              onPress={resetFilters}
              accessibilityRole="button"
              accessibilityLabel="Xóa tất cả bộ lọc"
              className="rounded-full bg-white/20 px-4 py-2"
            >
              <Text className="text-xs font-bold text-primary-foreground">Xóa lọc</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="mt-5">
          <SearchBar
            value={filters.keyword}
            onChangeText={setKeyword}
            onClear={() => setKeyword("")}
          />
        </View>
      </View>

      <Text className="mt-6 text-sm font-bold text-foreground">Loài thú cưng</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingTop: 14, paddingBottom: 6 }}
      >
        <CategoryList selectedSpecies={filters.species} onSelect={setSpecies} />
      </ScrollView>

      <Text className="mt-5 text-sm font-bold text-foreground">Bộ lọc nhanh</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingTop: 12, paddingBottom: 2 }}
      >
        <FilterChips selectedStatus={filters.status} onSelect={setStatus} />
      </ScrollView>

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
        renderItem={({ item }) => <PetListItem pet={item} width={cardWidth} />}
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
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-5">
              <ActivityIndicator />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
