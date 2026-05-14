import { Input } from "@/components/ui";
import { httpAxios } from "@/src/infrastructure/api/client/http";
import type { CreateRescueCaseRequestDto } from "@/src/infrastructure/api/generated/model";
import { report } from "@/src/infrastructure/api/generated/pet-rescue-api";
import { container } from "@/src/infrastructure/di";
import { MapMarkerCard } from "@/src/presentation/components/map/MapMarkerCard";
import { MapSidebar } from "@/src/presentation/components/map/MapSidebar";
import {
  DEFAULT_MAP_BOUNDS,
  MAP_PANEL_HEIGHT,
  MAP_VIEWPORT,
  type MapBounds,
  type MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { useMapMarkers } from "@/src/presentation/hooks/use-map-markers";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";

type HeaderFilter = "rescue" | "vet" | "center";

const FILTERS: { key: HeaderFilter; label: string; emoji: string }[] = [
  { key: "rescue", label: "Rescue", emoji: "🆘" },
  { key: "vet", label: "Vet", emoji: "🐾" },
  { key: "center", label: "Center", emoji: "🏥" },
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const MARKER_ICONS = {
  rescue: require("../../../assets/icons/location.png"),
  vet: require("../../../assets/icons/vet.png"),
  center: require("../../../assets/icons/animal-shelter.png"),
} as const;

const regionToBounds = (region: Region): MapBounds => ({
  minLat: region.latitude - region.latitudeDelta / 2,
  minLng: region.longitude - region.longitudeDelta / 2,
  maxLat: region.latitude + region.latitudeDelta / 2,
  maxLng: region.longitude + region.longitudeDelta / 2,
});

const normalizeMediaAsset = (asset: ImagePicker.ImagePickerAsset) => ({
  uri: asset.uri,
  name: asset.fileName ?? `image-${Date.now()}.jpg`,
  type: asset.mimeType ?? "image/jpeg",
});

const toReadableLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isDisplayableDetailKey = (key: string) => {
  const lowered = key.toLowerCase();
  return !(lowered.includes("id") || lowered.includes("code"));
};

const formatDetailValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() ? value : null;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (Array.isArray(value)) {
    const primitiveValues = value.filter(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    );
    if (primitiveValues.length === 0) return null;
    return primitiveValues.join(", ");
  }
  return null;
};

export default function MapScreen() {
  const [selectedFilters, setSelectedFilters] = useState<Set<HeaderFilter>>(
    new Set(["rescue"]),
  );
  const [viewportBounds, setViewportBounds] =
    useState<MapBounds>(DEFAULT_MAP_BOUNDS);
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | undefined>(
    undefined,
  );
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createLat, setCreateLat] = useState("");
  const [createLng, setCreateLng] = useState("");
  const [createSending, setCreateSending] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createColor, setCreateColor] = useState("");
  const [createPriority, setCreatePriority] = useState("CRITICAL");
  const [createContact, setCreateContact] = useState("");
  const [selectedImages, setSelectedImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [wardName, setWardName] = useState("");
  const [wardsList, setWardsList] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [loadingWards, setLoadingWards] = useState(false);
  const [provincesList, setProvincesList] = useState<
    { code: string; name: string }[]
  >([]);
  const [provinceSearchRaw, setProvinceSearchRaw] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [wardSearchRaw, setWardSearchRaw] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [markerDetailVisible, setMarkerDetailVisible] = useState(false);
  const [markerDetailLoading, setMarkerDetailLoading] = useState(false);
  const [markerDetail, setMarkerDetail] = useState<any>(null);
  const [markerDetailError, setMarkerDetailError] = useState<string | null>(
    null,
  );
  const provinceLoadInitiatedRef = useRef(false);

  const toggleFilter = useCallback((key: HeaderFilter) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Build queries based on selected filters
  const hasRescue = selectedFilters.has("rescue");
  const hasVet = selectedFilters.has("vet");
  const hasCenter = selectedFilters.has("center");
  const showAll = selectedFilters.size === 0;

  // Determine org types to fetch
  const orgTypes: string[] = [];
  if (showAll || hasVet) orgTypes.push("VET_CENTER");
  if (showAll || hasCenter) orgTypes.push("SHELTER");

  // Fetch rescue markers (when rescue is selected or showing all)
  const rescueMarkersQuery = useMapMarkers(
    showAll || hasRescue
      ? { source: "rescue", bounds: appliedBounds }
      : { source: "rescue", bounds: undefined },
  );

  // Fetch organization markers (when org filters are selected or showing all)
  const orgMarkersQuery = useMapMarkers(
    orgTypes.length > 0
      ? {
          source: "organization",
          bounds: appliedBounds,
          organizationTypes: orgTypes,
        }
      : { source: "organization", bounds: undefined },
  );

  // Merge markers from both queries
  const markers = useMemo(() => {
    const combined: any[] = [];
    if ((showAll || hasRescue) && rescueMarkersQuery.data) {
      combined.push(...rescueMarkersQuery.data);
    }
    if (orgTypes.length > 0 && orgMarkersQuery.data) {
      combined.push(...orgMarkersQuery.data);
    }
    return combined;
  }, [
    showAll,
    hasRescue,
    orgTypes.length,
    rescueMarkersQuery.data,
    orgMarkersQuery.data,
  ]);

  const isLoading = rescueMarkersQuery.isLoading || orgMarkersQuery.isLoading;
  const error = rescueMarkersQuery.error || orgMarkersQuery.error;
  const visibleMarkers = markers;

  const selectedMarker = useMemo(
    () => markers.find((item) => item.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId],
  );

  const detailRows = useMemo(() => {
    if (!markerDetail || typeof markerDetail !== "object")
      return [] as { label: string; value: string }[];
    return Object.entries(markerDetail)
      .filter(([key]) => isDisplayableDetailKey(key))
      .filter(([key]) => !["imageUrl", "imageUrls"].includes(key))
      .map(([key, value]) => {
        const formatted = formatDetailValue(value);
        return formatted
          ? { label: toReadableLabel(key), value: formatted }
          : null;
      })
      .filter(
        (item): item is { label: string; value: string } => item !== null,
      );
  }, [markerDetail]);

  const mapRegion: Region = {
    latitude: MAP_VIEWPORT.latitude,
    longitude: MAP_VIEWPORT.longitude,
    latitudeDelta: MAP_VIEWPORT.latitudeDelta,
    longitudeDelta: MAP_VIEWPORT.longitudeDelta,
  };

  const isWeb = Platform.OS === "web";

  const openCreateModal = (latitude: number, longitude: number) => {
    setCreateLat(latitude.toFixed(6));
    setCreateLng(longitude.toFixed(6));
    setCreateError(null);
    setCreateVisible(true);
  };

  const resetCreateForm = useCallback(() => {
    setCreateTitle("");
    setCreateDescription("");
    setCreateColor("");
    setCreatePriority("CRITICAL");
    setCreateContact("");
    setSelectedImages([]);
    setProvinceCode("");
    setProvinceName("");
    setWardCode("");
    setWardName("");
    setWardsList([]);
    setProvinceSearch("");
    setWardSearch("");
  }, []);

  const closeCreateModal = useCallback(() => {
    setCreateVisible(false);
    setCreateError(null);
    resetCreateForm();
  }, [resetCreateForm]);

  const loadProvinces = useCallback(async () => {
    try {
      console.log("🏗️ [Province API] Loading provinces...");
      const items = await container.location.getProvincesUseCase.execute();
      console.log(
        `✅ [Province API] Loaded ${items.length} provinces:`,
        items.map((item) => ({ code: item.code, name: item.name })),
      );
      setProvincesList(
        items.map((item) => ({ code: item.code, name: item.name })),
      );
    } catch (error) {
      console.error(
        "❌ [Province API] Error loading provinces:",
        error instanceof Error ? error.message : error,
      );
      setProvincesList([]);
    }
  }, []);

  const loadWardsForProvince = useCallback(async (code: string) => {
    if (!code) return;
    setLoadingWards(true);
    try {
      console.log(`🏘️ [Ward API] Loading wards for province: ${code}`);
      const data =
        await container.location.getProvinceDetailUseCase.execute(code);
      console.log(
        `✅ [Ward API] Loaded ${data.wards.length} wards:`,
        data.wards.map((ward) => ({ code: ward.code, name: ward.name })),
      );
      setProvinceName(data.name ?? "");
      setWardsList(
        data.wards.map((ward) => ({ code: ward.code, name: ward.name })),
      );
    } catch (error) {
      console.error(
        "❌ [Ward API] Error loading wards:",
        error instanceof Error ? error.message : error,
      );
      setWardsList([]);
    } finally {
      setLoadingWards(false);
    }
  }, []);

  useEffect(() => {
    if (
      createVisible &&
      provincesList.length === 0 &&
      !provinceLoadInitiatedRef.current
    ) {
      provinceLoadInitiatedRef.current = true;
      void loadProvinces();
    } else if (!createVisible) {
      provinceLoadInitiatedRef.current = false;
    }
  }, [createVisible, provincesList.length, loadProvinces]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProvinceSearch(provinceSearchRaw);
      if (provinceSearchRaw) {
        const matches = provincesList.filter((p) =>
          p.name.toLowerCase().includes(provinceSearchRaw.toLowerCase()),
        );
        console.log(
          `🔍 [Province Search] "${provinceSearchRaw}" → ${matches.length} matches:`,
          matches.map((m) => m.name),
        );
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [provinceSearchRaw, provincesList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWardSearch(wardSearchRaw);
      if (wardSearchRaw && wardsList.length > 0) {
        const matches = wardsList.filter((w) =>
          w.name.toLowerCase().includes(wardSearchRaw.toLowerCase()),
        );
        console.log(
          `🔍 [Ward Search] "${wardSearchRaw}" → ${matches.length} matches:`,
          matches.map((m) => m.name),
        );
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [wardSearchRaw, wardsList]);

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setCreateError("Cần cấp quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    setSelectedImages((current) => [
      ...current,
      ...result.assets.map(normalizeMediaAsset),
    ]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }, []);

  const uploadSelectedImages = useCallback(async () => {
    if (selectedImages.length === 0) {
      return [] as string[];
    }

    const uploaded = await Promise.all(
      selectedImages.map((asset) =>
        container.media.uploadMediaUseCase.execute(asset, "rescue-cases"),
      ),
    );

    return uploaded.map((item) => item.publicId);
  }, [selectedImages]);

  const loadMarkerDetail = useCallback(async () => {
    if (!selectedMarker) return;
    setMarkerDetailLoading(true);
    setMarkerDetailError(null);
    try {
      let endpoint = "";
      if (selectedMarker.source === "rescue") {
        endpoint = `/api/v1/rescue-cases/${selectedMarker.id}`;
      } else if (selectedMarker.source === "organization") {
        endpoint = `/api/v1/organizations/${selectedMarker.id}`;
      }

      if (!endpoint) throw new Error("Unknown marker source");

      const response = await httpAxios.get(endpoint);
      setMarkerDetail(response.data?.data);
      setMarkerDetailVisible(true);
    } catch (error) {
      console.error("Failed to load marker detail:", error);
      setMarkerDetailError(
        "Không thể tải thông tin chi tiết. Vui lòng thử lại.",
      );
    } finally {
      setMarkerDetailLoading(false);
    }
  }, [selectedMarker]);

  const submitRescue = useCallback(async () => {
    setCreateError(null);
    const lat = Number(createLat);
    const lng = Number(createLng);

    if (!createTitle.trim()) {
      setCreateError("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setCreateError("Vui lòng nhập tọa độ hợp lệ.");
      return;
    }

    let imageUrls: string[] | undefined;

    try {
      setCreateSending(true);
      imageUrls = await uploadSelectedImages();
      const payload: CreateRescueCaseRequestDto = {
        species: createTitle.trim(),
        description: createDescription.trim() || undefined,
        color: createColor || undefined,
        priority: (createPriority as any) || undefined,
        latitude: lat,
        longitude: lng,
        locationText: [
          provinceName,
          wardName,
          `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`,
        ]
          .filter(Boolean)
          .join(" - "),
        provinceCode: provinceCode || undefined,
        provinceName: provinceName || undefined,
        wardCode: wardCode || undefined,
        wardName: wardName || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        contactPhone: createContact || undefined,
      };

      await report(payload);
      closeCreateModal();
    } catch {
      setCreateError("Không gửi được báo cứu hộ. Vui lòng thử lại.");
    } finally {
      setCreateSending(false);
    }
  }, [
    closeCreateModal,
    createColor,
    createContact,
    createDescription,
    createLat,
    createLng,
    createPriority,
    createTitle,
    provinceCode,
    provinceName,
    uploadSelectedImages,
    wardName,
    wardCode,
  ]);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        {isWeb ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-sm text-muted-foreground">
              Bản đồ native đang dùng react-native-maps, vui lòng chạy trên
              Android/iOS để xem marker.
            </Text>
          </View>
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            googleRenderer="LEGACY"
            style={{ flex: 1 }}
            initialRegion={mapRegion}
            onRegionChangeComplete={(region) => {
              setViewportBounds(regionToBounds(region));
            }}
            onPress={() => {
              // Close selected marker when tapping on map background
              setSelectedMarkerId(null);
            }}
            onLongPress={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              openCreateModal(latitude, longitude);
            }}
          >
            {visibleMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() => {
                  setSelectedMarkerId(marker.id);
                }}
                onCalloutPress={() => {
                  // Prevent map tap when interacting with marker
                }}
              >
                {/* <Image
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                  }}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/5860/5860579.png",
                  }}
                  resizeMode="contain"
                >
                </Image> */}
                <MapPinMarker source={marker.source} />
              </Marker>
            ))}
          </MapView>
        )}

        <View className="absolute left-0 right-0 top-0">
          <View className="bg-background px-4 pb-3  border-t border-border">
            <View className="mt-3 flex-row gap-2">
              {FILTERS.map((item) => {
                const active = selectedFilters.has(item.key);
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => toggleFilter(item.key)}
                    className={`flex-1 flex-row items-center justify-center gap-1 rounded-full border px-3 py-2 ${
                      active
                        ? "border-transparent bg-white"
                        : "border-white/25 bg-white/10"
                    }`}
                  >
                    <Text>{item.emoji}</Text>
                    <Text
                      className={`text-[11px] font-bold ${
                        active ? "text-primary" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {!selectedMarker ? null : (
          <View
            className="absolute left-4 right-4 flex-row gap-2 items-center"
            style={{ bottom: MAP_PANEL_HEIGHT + 12 }}
          >
            <View className="flex-1">
              <MapMarkerCard marker={selectedMarker} compact />
            </View>
            <Pressable
              onPress={() => void loadMarkerDetail()}
              className="h-10 w-10 items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-lg">👁️</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View className="absolute right-4 bottom-4 z-20">
        <Pressable
          onPress={() => setPanelVisible(true)}
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg"
        >
          <Text className="text-lg text-primary-foreground">⚙️</Text>
        </Pressable>
      </View>

      <View className="absolute left-4 bottom-4 z-20">
        <Pressable
          onPress={() => {
            const centerLat =
              (viewportBounds.minLat + viewportBounds.maxLat) / 2;
            const centerLng =
              (viewportBounds.minLng + viewportBounds.maxLng) / 2;
            openCreateModal(centerLat, centerLng);
          }}
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-green-600 shadow-lg"
        >
          <Text className="text-lg text-white">＋</Text>
        </Pressable>
      </View>

      <MapSidebar
        visible={panelVisible}
        onClose={() => setPanelVisible(false)}
        bounds={appliedBounds}
        viewportBounds={viewportBounds}
        onApplyViewportBounds={() => {
          setAppliedBounds(viewportBounds);
          setSelectedMarkerId(null);
          setPanelVisible(false);
        }}
        markers={visibleMarkers}
        loading={isLoading}
        error={
          typeof error === "string"
            ? error
            : error
              ? "Không tải được dữ liệu bản đồ."
              : null
        }
        onSelectMarker={(marker) => setSelectedMarkerId(marker.id)}
      />

      <Modal
        transparent
        visible={createVisible}
        animationType="slide"
        onRequestClose={closeCreateModal}
      >
        <View className="flex-1 justify-end bg-black/35">
          <Pressable className="flex-1" onPress={closeCreateModal} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="max-h-[92%] rounded-t-3xl bg-background"
          >
            <ScrollView
              className="px-4 pt-5 pb-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Section */}
              <View className="mb-5">
                <Text className="text-2xl font-bold text-foreground">
                  🆘 Báo cứu hộ mới
                </Text>
                <Text className="mt-2 text-sm text-muted-foreground">
                  Nhấn giữ bản đồ chọn vị trí hoặc dùng nút + để lấy tâm hiện
                  tại
                </Text>
              </View>

              {/* Basic Info Card */}
              <View className="mb-5 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                  Thông tin cơ bản
                </Text>

                <View className="mb-4">
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Loại động vật
                  </Text>
                  <Input
                    value={createTitle}
                    onChangeText={setCreateTitle}
                    placeholder="Ví dụ: Chó, Mèo, Chim..."
                  />
                </View>

                <View>
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Mô tả chi tiết
                  </Text>
                  <Input
                    value={createDescription}
                    onChangeText={setCreateDescription}
                    placeholder="Mô tả tình trạng, địa điểm, hành vi..."
                    multiline
                  />
                </View>
              </View>

              {/* Appearance Card */}
              <View className="mb-5 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                  Đặc điểm
                </Text>

                <View className="mb-4">
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Màu sắc
                  </Text>
                  <Input
                    value={createColor}
                    onChangeText={setCreateColor}
                    placeholder="Ví dụ: Trắng đen, Nâu..."
                  />
                </View>

                <View>
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Mức ưu tiên
                  </Text>
                  <View className="flex-row gap-2">
                    {PRIORITIES.map((p) => (
                      <Pressable
                        key={p}
                        onPress={() => setCreatePriority(p)}
                        className={`flex-1 items-center rounded-lg py-2.5 ${
                          createPriority === p
                            ? "bg-primary"
                            : "border border-border bg-muted/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            createPriority === p
                              ? "text-primary-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {p}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Photos Card */}
              <View className="mb-5 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                  Ảnh minh họa
                </Text>

                <Pressable
                  onPress={() => void pickImage()}
                  className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-8"
                >
                  <Text className="text-center font-semibold text-foreground">
                    📸 Thêm ảnh từ thư viện
                  </Text>
                </Pressable>

                {selectedImages.length > 0 && (
                  <View className="mt-4">
                    <Text className="mb-3 text-xs font-semibold text-muted-foreground">
                      Đã chọn ({selectedImages.length})
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      {selectedImages.map((image, index) => (
                        <View
                          key={`${image.uri}-${index}`}
                          className="relative w-[30%] overflow-hidden rounded-xl bg-muted"
                        >
                          <ExpoImage
                            source={{ uri: image.uri }}
                            style={{ width: "100%", aspectRatio: 1 }}
                            contentFit="cover"
                          />
                          <Pressable
                            onPress={() => removeImage(index)}
                            className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/70"
                          >
                            <Text className="text-[10px] font-bold text-white">
                              ✕
                            </Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Location Card */}
              <View className="mb-5 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                  Vị trí
                </Text>

                <View className="mb-4">
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Tỉnh/Thành phố
                  </Text>
                  <Input
                    value={provinceSearchRaw}
                    onChangeText={setProvinceSearchRaw}
                    placeholder="Tìm kiếm tỉnh..."
                  />
                  {provincesList.length > 0 && (
                    <View className="mt-2 max-h-32 rounded-lg border border-border bg-muted/20 p-2">
                      <ScrollView nestedScrollEnabled>
                        {provincesList
                          .filter((p) =>
                            p.name
                              .toLowerCase()
                              .includes(provinceSearch.toLowerCase()),
                          )
                          .map((p) => (
                            <Pressable
                              key={p.code}
                              onPress={() => {
                                setProvinceCode(p.code);
                                setProvinceName(p.name);
                                setWardCode("");
                                setWardName("");
                                setWardSearchRaw("");
                                void loadWardsForProvince(p.code);
                                console.log(
                                  `📍 [Province] Selected: ${p.name} (${p.code})`,
                                );
                              }}
                              className={`rounded-lg px-3 py-2.5 ${
                                provinceCode === p.code
                                  ? "bg-primary"
                                  : "bg-transparent"
                              }`}
                            >
                              <Text
                                className={`text-sm font-medium ${
                                  provinceCode === p.code
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {p.name}
                              </Text>
                            </Pressable>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                    Phường/Xã
                  </Text>
                  <Input
                    value={wardSearchRaw}
                    onChangeText={setWardSearchRaw}
                    placeholder="Tìm kiếm phường..."
                    editable={Boolean(provinceCode)}
                  />
                  {!provinceCode && (
                    <Text className="mt-2 text-xs text-muted-foreground">
                      ℹ️ Chọn tỉnh/thành trước
                    </Text>
                  )}
                  {loadingWards && (
                    <Text className="mt-2 text-xs text-muted-foreground">
                      ⏳ Đang tải...
                    </Text>
                  )}
                  {wardsList.length > 0 && (
                    <View className="mt-2 max-h-32 rounded-lg border border-border bg-muted/20 p-2">
                      <ScrollView nestedScrollEnabled>
                        {wardsList
                          .filter((w) =>
                            w.name
                              .toLowerCase()
                              .includes(wardSearch.toLowerCase()),
                          )
                          .map((w) => (
                            <Pressable
                              key={w.code}
                              onPress={() => {
                                setWardCode(w.code);
                                setWardName(w.name);
                                console.log(
                                  `📍 [Ward] Selected: ${w.name} (${w.code})`,
                                );
                              }}
                              className={`rounded-lg px-3 py-2.5 ${
                                wardCode === w.code
                                  ? "bg-primary"
                                  : "bg-transparent"
                              }`}
                            >
                              <Text
                                className={`text-sm font-medium ${
                                  wardCode === w.code
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {w.name}
                              </Text>
                            </Pressable>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {(provinceName || wardName) && (
                  <View className="mb-4 rounded-lg bg-primary/10 p-3">
                    <Text className="text-xs font-semibold text-primary">
                      📌 Địa điểm:{" "}
                      {[wardName, provinceName].filter(Boolean).join(", ")}
                    </Text>
                  </View>
                )}

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                      Latitude
                    </Text>
                    <Input
                      value={createLat}
                      onChangeText={setCreateLat}
                      keyboardType="numeric"
                      placeholder="0.000000"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                      Longitude
                    </Text>
                    <Input
                      value={createLng}
                      onChangeText={setCreateLng}
                      keyboardType="numeric"
                      placeholder="0.000000"
                    />
                  </View>
                </View>
              </View>

              {/* Contact Card */}
              <View className="mb-5 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                  Liên hệ
                </Text>

                <Input
                  value={createContact}
                  onChangeText={setCreateContact}
                  keyboardType="phone-pad"
                  placeholder="Số điện thoại của bạn"
                />
              </View>

              {/* Error Message */}
              {createError && (
                <View className="mb-4 rounded-lg bg-destructive/10 px-3 py-2.5">
                  <Text className="text-sm font-medium text-destructive">
                    ⚠️ {createError}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={closeCreateModal}
                  className="flex-1 items-center rounded-xl border border-border bg-muted px-4 py-3.5"
                >
                  <Text className="font-bold text-foreground">Hủy</Text>
                </Pressable>

                <Pressable
                  onPress={submitRescue}
                  disabled={createSending}
                  className="flex-1 items-center rounded-xl bg-primary px-4 py-3.5"
                >
                  {createSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-bold text-primary-foreground">
                      🆘 Gửi báo cứu hộ
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        transparent
        visible={markerDetailVisible}
        animationType="fade"
        onRequestClose={() => setMarkerDetailVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50 px-4 py-6">
          <View className="max-h-[90%] overflow-hidden rounded-3xl bg-card">
            <ScrollView showsVerticalScrollIndicator={false}>
              {markerDetailLoading ? (
                <View className="items-center justify-center py-12">
                  <ActivityIndicator size="large" />
                </View>
              ) : markerDetailError ? (
                <View className="items-center justify-center p-6">
                  <Text className="text-center text-sm text-destructive">
                    {markerDetailError}
                  </Text>
                </View>
              ) : markerDetail ? (
                <>
                  {/* Images Section - Displayed First */}
                  {(Array.isArray(markerDetail.imageUrls) &&
                    markerDetail.imageUrls.length > 0) ||
                  (typeof markerDetail.imageUrl === "string" &&
                    markerDetail.imageUrl.trim()) ? (
                    <View>
                      {Array.isArray(markerDetail.imageUrls) &&
                      markerDetail.imageUrls.length > 0 ? (
                        <View className="flex-row flex-wrap gap-2 bg-muted/30 p-4">
                          {markerDetail.imageUrls
                            .slice(0, 4)
                            .map((url: string, i: number) => (
                              <ExpoImage
                                key={`${url}-${i}`}
                                source={{ uri: url }}
                                style={{
                                  width: "48%",
                                  height: 120,
                                  borderRadius: 12,
                                }}
                                contentFit="cover"
                              />
                            ))}
                        </View>
                      ) : typeof markerDetail.imageUrl === "string" &&
                        markerDetail.imageUrl.trim() ? (
                        <View className="p-4 pb-0">
                          <ExpoImage
                            source={{ uri: markerDetail.imageUrl }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 12,
                            }}
                            contentFit="cover"
                          />
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  {/* Header Section */}
                  <View className="border-b border-border px-4 py-4">
                    <Text className="text-lg font-bold text-foreground">
                      {selectedMarker?.source === "rescue"
                        ? "Chi tiết cứu hộ"
                        : "Chi tiết tổ chức"}
                    </Text>
                    <Text className="mt-1 text-xs text-muted-foreground">
                      {selectedMarker?.source === "rescue"
                        ? "Thông tin chi tiết vụ cứu hộ động vật"
                        : "Thông tin chi tiết tổ chức"}
                    </Text>
                  </View>

                  {/* Details Section */}
                  <View className="gap-0 p-4">
                    {detailRows.map((row, idx) => (
                      <View
                        key={row.label}
                        className={`border-b border-border/50 py-3 ${
                          idx === detailRows.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <Text className="text-[11px] font-semibold uppercase text-muted-foreground">
                          {row.label}
                        </Text>
                        <Text className="mt-2 text-sm font-medium text-foreground">
                          {row.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </ScrollView>

            {/* Close Button */}
            <View className="border-t border-border bg-card px-4 py-3">
              <Pressable
                onPress={() => setMarkerDetailVisible(false)}
                className="items-center rounded-full bg-muted px-4 py-3"
              >
                <Text className="font-semibold text-foreground">Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const MapPinMarker = ({ source }: { source: MapSourceKey }) => {
  // For organizations, use a default icon since we don't have type info at render time
  const iconSource =
    source === "rescue" ? MARKER_ICONS.rescue : MARKER_ICONS.center; // Default to center/shelter icon for all organizations

  return (
    <Image
      source={iconSource}
      style={{
        width: 33,
        height: 33,
      }}
      resizeMode="contain"
      fadeDuration={0}
    />
  );
};
