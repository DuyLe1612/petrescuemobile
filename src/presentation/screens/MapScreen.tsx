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
  TextInput,
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
  const [filter, setFilter] = useState<HeaderFilter>("rescue");
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

  const markerQuery = useMemo(() => {
    if (filter === "rescue") {
      return {
        source: "rescue" as MapSourceKey,
      };
    }

    return {
      source: "organization" as MapSourceKey,
      organizationTypes: [filter === "vet" ? "VET_CENTER" : "SHELTER"],
    };
  }, [filter]);

  const {
    data: markers = [],
    isLoading,
    error,
  } = useMapMarkers({
    source: markerQuery.source,
    bounds: appliedBounds,
    organizationTypes: markerQuery.organizationTypes,
  });

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
      const items = await container.location.getProvincesUseCase.execute();
      setProvincesList(
        items.map((item) => ({ code: item.code, name: item.name })),
      );
    } catch {
      setProvincesList([]);
    }
  }, []);

  const loadWardsForProvince = useCallback(async (code: string) => {
    if (!code) return;
    setLoadingWards(true);
    try {
      const data =
        await container.location.getProvinceDetailUseCase.execute(code);
      setProvinceName(data.name ?? "");
      setWardsList(
        data.wards.map((ward) => ({ code: ward.code, name: ward.name })),
      );
    } catch {
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
    }, 300);
    return () => clearTimeout(timer);
  }, [provinceSearchRaw]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWardSearch(wardSearchRaw);
    }, 300);
    return () => clearTimeout(timer);
  }, [wardSearchRaw]);

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
                <MapPinMarker source={marker.source} filter={filter} />
              </Marker>
            ))}
          </MapView>
        )}

        <View className="absolute left-0 right-0 top-0">
          <View className="bg-primary px-4 pb-3 pt-12">
            <View className="mt-3 flex-row gap-2">
              {FILTERS.map((item) => {
                const active = filter === item.key;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setFilter(item.key)}
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
            className="max-h-[92%] rounded-t-3xl bg-card"
          >
            <ScrollView
              className="px-4 pt-4 pb-5"
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-lg font-extrabold text-foreground">
                Báo cứu hộ mới
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground">
                Nhấn giữ trên bản đồ để chọn điểm, hoặc dùng nút + để lấy tâm
                màn hình hiện tại.
              </Text>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Tiêu đề
                </Text>
                <TextInput
                  value={createTitle}
                  onChangeText={setCreateTitle}
                  placeholder="Ví dụ: Chó bị lạc"
                  className="rounded-xl border border-border px-3 py-2 text-foreground"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Chi tiết
                </Text>
                <TextInput
                  value={createDescription}
                  onChangeText={setCreateDescription}
                  placeholder="Mô tả tình trạng"
                  multiline
                  className="min-h-[84px] rounded-xl border border-border px-3 py-2 text-foreground"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Màu
                </Text>
                <TextInput
                  value={createColor}
                  onChangeText={setCreateColor}
                  placeholder="Ví dụ: brown"
                  className="rounded-xl border border-border px-3 py-2 text-foreground"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Mức ưu tiên
                </Text>
                <View className="flex-row gap-2">
                  {PRIORITIES.map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setCreatePriority(p)}
                      className={`px-3 py-2 rounded-full ${createPriority === p ? "bg-primary" : "bg-muted/20"}`}
                    >
                      <Text
                        className={`${createPriority === p ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {p}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Số điện thoại liên hệ
                </Text>
                <TextInput
                  value={createContact}
                  onChangeText={setCreateContact}
                  keyboardType="phone-pad"
                  placeholder="Số điện thoại"
                  className="rounded-xl border border-border px-3 py-2 text-foreground"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Ảnh báo cứu hộ
                </Text>
                <Pressable
                  onPress={() => void pickImage()}
                  className="flex-row items-center justify-center rounded-xl border border-dashed border-border px-3 py-3"
                >
                  <Text className="font-semibold text-foreground">
                    Thêm ảnh từ máy
                  </Text>
                </Pressable>
                {selectedImages.length > 0 ? (
                  <View className="mt-3 flex-row flex-wrap gap-3">
                    {selectedImages.map((image, index) => (
                      <View
                        key={`${image.uri}-${index}`}
                        className="w-[30%] overflow-hidden rounded-xl border border-border bg-muted/20"
                      >
                        <ExpoImage
                          source={{ uri: image.uri }}
                          style={{ width: "100%", aspectRatio: 1 }}
                          contentFit="cover"
                        />
                        <Pressable
                          onPress={() => removeImage(index)}
                          className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/65"
                        >
                          <Text className="text-[10px] font-bold text-white">
                            x
                          </Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Tỉnh/Thành
                </Text>
                <TextInput
                  value={provinceSearchRaw}
                  onChangeText={setProvinceSearchRaw}
                  placeholder="Tìm tỉnh..."
                  className="rounded-xl border border-border px-3 py-2 text-foreground"
                />

                {provincesList.length > 0 ? (
                  <View className="mt-2 max-h-40 rounded-md border border-border bg-card p-2">
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
                          }}
                          className="py-2"
                        >
                          <Text
                            className={`text-sm ${provinceCode === p.code ? "font-bold text-primary" : "text-foreground"}`}
                          >
                            {p.name}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                ) : null}
              </View>

              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                  Phường/Xã
                </Text>
                <TextInput
                  value={wardSearchRaw}
                  onChangeText={setWardSearchRaw}
                  placeholder="Tìm phường..."
                  className="rounded-xl border border-border px-3 py-2 text-foreground"
                  editable={Boolean(provinceCode)}
                />
                {!provinceCode ? (
                  <Text className="mt-2 text-sm text-muted-foreground">
                    Chọn tỉnh/thành trước để tải danh sách phường/xã.
                  </Text>
                ) : null}
                {loadingWards ? (
                  <Text className="mt-2 text-sm text-muted-foreground">
                    Đang tải phường...
                  </Text>
                ) : null}
                {wardsList.length > 0 ? (
                  <View className="mt-2 max-h-40 rounded-md border border-border bg-card p-2">
                    {wardsList
                      .filter((w) =>
                        w.name.toLowerCase().includes(wardSearch.toLowerCase()),
                      )
                      .map((w) => (
                        <Pressable
                          key={w.code}
                          onPress={() => {
                            setWardCode(w.code);
                            setWardName(w.name);
                          }}
                          className="py-2"
                        >
                          <Text
                            className={`text-sm ${wardCode === w.code ? "font-bold text-primary" : "text-foreground"}`}
                          >
                            {w.name}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                ) : null}
              </View>

              <View className="mt-3 flex-row gap-3">
                <View className="flex-1">
                  <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                    Latitude
                  </Text>
                  <TextInput
                    value={createLat}
                    onChangeText={setCreateLat}
                    keyboardType="numeric"
                    className="rounded-xl border border-border px-3 py-2 text-foreground"
                  />
                </View>

                <View className="flex-1">
                  <Text className="mb-1 text-xs font-semibold text-muted-foreground">
                    Longitude
                  </Text>
                  <TextInput
                    value={createLng}
                    onChangeText={setCreateLng}
                    keyboardType="numeric"
                    className="rounded-xl border border-border px-3 py-2 text-foreground"
                  />
                </View>
              </View>

              {provinceName || wardName ? (
                <Text className="mt-3 text-xs text-muted-foreground">
                  Đã chọn: {[wardName, provinceName].filter(Boolean).join(", ")}
                </Text>
              ) : null}

              {createError ? (
                <Text className="mt-3 text-sm text-destructive">
                  {createError}
                </Text>
              ) : null}

              <View className="mt-4 flex-row gap-2">
                <Pressable
                  onPress={closeCreateModal}
                  className="flex-1 items-center rounded-full border border-border px-4 py-3"
                >
                  <Text className="font-bold text-foreground">Hủy</Text>
                </Pressable>

                <Pressable
                  onPress={submitRescue}
                  disabled={createSending}
                  className="flex-1 items-center rounded-full bg-primary px-4 py-3"
                >
                  {createSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-bold text-primary-foreground">
                      Gửi báo cứu hộ
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
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="max-h-[85%] rounded-2xl bg-card p-4">
            {markerDetailLoading ? (
              <ActivityIndicator size="large" />
            ) : markerDetailError ? (
              <Text className="text-sm text-destructive">
                {markerDetailError}
              </Text>
            ) : markerDetail ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-lg font-bold text-foreground">
                  {selectedMarker?.source === "rescue"
                    ? "Chi tiet cuu ho"
                    : "Chi tiet to chuc"}
                </Text>

                <View className="mt-3 gap-2">
                  {detailRows.map((row) => (
                    <View
                      key={row.label}
                      className="rounded-xl border border-border px-3 py-2"
                    >
                      <Text className="text-xs font-semibold text-muted-foreground">
                        {row.label}
                      </Text>
                      <Text className="mt-1 text-sm text-foreground">
                        {row.value}
                      </Text>
                    </View>
                  ))}
                </View>

                {Array.isArray(markerDetail.imageUrls) &&
                markerDetail.imageUrls.length > 0 ? (
                  <View className="mt-3">
                    <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                      Hinh anh
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {markerDetail.imageUrls.map((url: string, i: number) => (
                        <ExpoImage
                          key={`${url}-${i}`}
                          source={{ uri: url }}
                          style={{ width: 96, height: 96, borderRadius: 8 }}
                          contentFit="cover"
                        />
                      ))}
                    </View>
                  </View>
                ) : null}

                {typeof markerDetail.imageUrl === "string" &&
                markerDetail.imageUrl.trim() ? (
                  <View className="mt-3">
                    <Text className="mb-2 text-xs font-semibold text-muted-foreground">
                      Hinh anh
                    </Text>
                    <ExpoImage
                      source={{ uri: markerDetail.imageUrl }}
                      style={{ width: "100%", height: 170, borderRadius: 8 }}
                      contentFit="cover"
                    />
                  </View>
                ) : null}
              </ScrollView>
            ) : null}

            <View className="mt-4 flex-row gap-2">
              <Pressable
                onPress={() => setMarkerDetailVisible(false)}
                className="flex-1 items-center rounded-full bg-muted px-4 py-2"
              >
                <Text className="font-semibold text-foreground">Dong</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const MapPinMarker = ({
  source,
  filter,
}: {
  source: MapSourceKey;
  filter: HeaderFilter;
}) => {
  const iconSource =
    source === "rescue"
      ? MARKER_ICONS.rescue
      : filter === "vet"
        ? MARKER_ICONS.vet
        : MARKER_ICONS.center;

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
