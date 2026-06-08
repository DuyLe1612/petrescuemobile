import { FormField, Input, Select } from "@/components/ui";
import type { MapMarker } from "@/src/domain/entities/map";
import { httpAxios } from "@/src/infrastructure/api/client/http";
import type {
  CreateRescueCaseRequestDto,
  CreateRescueCompletionRequestDto,
} from "@/src/infrastructure/api/generated/model";
import {
  report,
  complete as submitRescueCompleteApi,
} from "@/src/infrastructure/api/generated/pet-rescue-api";
import { mediaApi } from "@/src/infrastructure/api/media/media-api";
import { container } from "@/src/infrastructure/di";
import { MapMarkerCard } from "@/src/presentation/components/map/MapMarkerCard";
import { MapSidebar } from "@/src/presentation/components/map/MapSidebar";
import {
  MAP_PANEL_HEIGHT,
  MAP_VIEWPORT,
  type MapBounds,
  type MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { useMapMarkers } from "@/src/presentation/hooks/use-map-markers";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
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
  { key: "rescue", label: "Cứu hộ", emoji: "🆘" },
  { key: "vet", label: "Phòng khám", emoji: "🐾" },
  { key: "center", label: "Trung tâm", emoji: "🏥" },
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

const DEFAULT_REGION: Region = {
  latitude: MAP_VIEWPORT.latitude,
  longitude: MAP_VIEWPORT.longitude,
  latitudeDelta: MAP_VIEWPORT.latitudeDelta,
  longitudeDelta: MAP_VIEWPORT.longitudeDelta,
};

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

const extractDetailImages = (detail: unknown): string[] => {
  if (!detail || typeof detail !== "object") return [];

  const imageUrls = new Set<string>();

  const appendImage = (value: unknown) => {
    if (typeof value === "string" && value.trim()) {
      imageUrls.add(value.trim());
      return;
    }

    if (!value || typeof value !== "object") return;

    const record = value as Record<string, unknown>;
    const candidates = [
      record.url,
      record.imageUrl,
      record.secureUrl,
      record.thumbnailUrl,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        imageUrls.add(candidate.trim());
      }
    }
  };

  const sources = [
    (detail as Record<string, unknown>).imageUrl,
    (detail as Record<string, unknown>).imageUrls,
    (detail as Record<string, unknown>).images,
    (detail as Record<string, unknown>).media,
    (detail as Record<string, unknown>).attachments,
  ];

  for (const source of sources) {
    if (Array.isArray(source)) {
      source.forEach(appendImage);
      continue;
    }

    appendImage(source);
  }

  return Array.from(imageUrls);
};

export default function MapScreen() {
  const [selectedFilters, setSelectedFilters] = useState<Set<HeaderFilter>>(
    new Set(["rescue"]),
  );
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  const [viewportBounds, setViewportBounds] = useState<MapBounds>(
    regionToBounds(DEFAULT_REGION),
  );
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
  const queryClient = useQueryClient();

  // State variables for rescue completion
  const [completeVisible, setCompleteVisible] = useState(false);
  const [completeImages, setCompleteImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [completeNote, setCompleteNote] = useState("");
  const [completeLocationNote, setCompleteLocationNote] = useState("");
  const [completeConfirmRescued, setCompleteConfirmRescued] = useState(false);
  const [completeSending, setCompleteSending] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

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
      .filter(
        ([key]) =>
          !["imageUrl", "imageUrls", "images", "media", "attachments"].includes(
            key,
          ),
      )
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

  const detailImages = useMemo(
    () => extractDetailImages(markerDetail),
    [markerDetail],
  );
  const detailStatus =
    typeof markerDetail?.status === "string"
      ? markerDetail.status.trim().toUpperCase()
      : "";
  const canCompleteRescue =
    selectedMarker?.source === "rescue" &&
    detailStatus !== "RESCUED" &&
    detailStatus !== "CLOSED";

  const isWeb = Platform.OS === "web";

  const openCreateModal = async (latitude: number, longitude: number) => {
    setCreateLat(latitude.toFixed(6));
    setCreateLng(longitude.toFixed(6));
    setCreateError(null);
    setCreateVisible(true);

    // Kích hoạt Reverse Geocoding để tự động điền địa chỉ
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        console.log("[Geocoding] Tọa độ tìm địa chỉ:", latitude, longitude);
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          console.log("[Geocoding] Địa chỉ phân tích được:", addr);

          const resolvedProvince = addr.region || addr.city || "";
          const resolvedWard = addr.subregion || addr.street || "";

          if (resolvedProvince) {
            setProvinceName(resolvedProvince);
            // Cố gắng tìm mã tỉnh phù hợp từ danh sách nếu đã tải
            const found = provincesList.find((p) =>
              p.name.toLowerCase().includes(resolvedProvince.toLowerCase()),
            );
            if (found) {
              setProvinceCode(found.code);
              void loadWardsForProvince(found.code);
            }
          }
          if (resolvedWard) {
            setWardName(resolvedWard);
          }
        }
      }
    } catch (e) {
      console.warn("Lỗi định vị địa chỉ:", e);
    }
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
      setProvincesList(
        items.map((item) => ({ code: item.code, name: item.name })),
      );
    } catch (error) {
      console.error("❌ [Province API] Error loading provinces:", error);
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
      setProvinceName(data.name ?? "");
      setWardsList(
        data.wards.map((ward) => ({ code: ward.code, name: ward.name })),
      );
    } catch (error) {
      console.error("❌ [Ward API] Error loading wards:", error);
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

  useEffect(() => {
    let active = true;
    const fetchLocationAndCenter = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission not granted");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (active && loc?.coords) {
          const { latitude, longitude } = loc.coords;
          console.log(
            "📍 [MapScreen] User current location on mount:",
            latitude,
            longitude,
          );

          const nextRegion: Region = {
            latitude,
            longitude,
            latitudeDelta: MAP_VIEWPORT.latitudeDelta,
            longitudeDelta: MAP_VIEWPORT.longitudeDelta,
          };

          setMapRegion(nextRegion);
          setViewportBounds(regionToBounds(nextRegion));
        }
      } catch (err) {
        console.warn("Error fetching current user location:", err);
      }
    };

    void fetchLocationAndCenter();
    return () => {
      active = false;
    };
  }, []);

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
      selectedImages.map((asset) => mediaApi.uploadTemp(asset, "rescue-cases")),
    );

    return uploaded
      .map((item) => item?.mediaId)
      .filter(
        (item): item is string => typeof item === "string" && item.length > 0,
      );
  }, [selectedImages]);

  const pickCompleteImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setCompleteError("Cần cấp quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    setCompleteImages((current) => [
      ...current,
      ...result.assets.map(normalizeMediaAsset),
    ]);
  }, []);

  const removeCompleteImage = useCallback((index: number) => {
    setCompleteImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }, []);

  const uploadCompleteImages = useCallback(async () => {
    if (completeImages.length === 0) {
      return [] as string[];
    }

    const uploaded = await Promise.all(
      completeImages.map((asset) =>
        container.media.uploadMediaUseCase.execute(asset, "rescue-cases"),
      ),
    );

    return uploaded.map((item) => item.mediaId);
  }, [completeImages]);

  const handleRescueComplete = useCallback(async () => {
    if (!selectedMarker) return;
    setCompleteError(null);

    if (completeImages.length === 0) {
      setCompleteError("Vui lòng cung cấp ít nhất 1 ảnh xác minh.");
      return;
    }

    if (!completeConfirmRescued) {
      setCompleteError("Vui lòng xác nhận đã cứu hộ thành công thú cưng.");
      return;
    }

    try {
      setCompleteSending(true);
      const mediaIds = await uploadCompleteImages();

      const payload: CreateRescueCompletionRequestDto = {
        caseId: selectedMarker.id,
        verificationImageIds: mediaIds,
        rescueNote: completeNote.trim() || undefined,
        locationNote: completeLocationNote.trim() || undefined,
        confirmRescued: completeConfirmRescued,
        rescuedAt: new Date().toISOString(),
      };

      await submitRescueCompleteApi(selectedMarker.id, payload);

      // Reset form states
      setCompleteVisible(false);
      setMarkerDetailVisible(false);
      setCompleteNote("");
      setCompleteLocationNote("");
      setCompleteConfirmRescued(false);
      setCompleteImages([]);

      // Invalidate queries to refresh the map markers
      await queryClient.invalidateQueries({ queryKey: ["map-markers"] });
      Alert.alert(
        "Thành công",
        "Chúc mừng! Ca cứu hộ đã hoàn thành thành công.",
      );
    } catch (error) {
      console.error("Failed to complete rescue case:", error);
      setCompleteError("Không thể hoàn thành ca cứu hộ. Vui lòng thử lại.");
    } finally {
      setCompleteSending(false);
    }
  }, [
    selectedMarker,
    completeImages,
    completeConfirmRescued,
    completeNote,
    completeLocationNote,
    uploadCompleteImages,
    queryClient,
  ]);

  const openCompleteModal = useCallback(() => {
    setCompleteError(null);
    setCompleteNote("");
    setCompleteLocationNote("");
    setCompleteConfirmRescued(false);
    setCompleteImages([]);
    setCompleteVisible(true);
  }, []);

  const loadMarkerDetail = useCallback(async (marker: MapMarker | null) => {
    if (!marker) return;
    setMarkerDetailLoading(true);
    setMarkerDetailError(null);
    try {
      let endpoint = "";
      if (marker.source === "rescue") {
        endpoint = `/api/v1/rescue-cases/${marker.id}`;
      } else if (marker.source === "organization") {
        endpoint = `/api/v1/organizations/${marker.id}`;
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
  }, []);

  const submitRescue = useCallback(async () => {
    setCreateError(null);
    const lat = Number(createLat);
    const lng = Number(createLng);

    if (!createTitle.trim()) {
      setCreateError("Vui lòng nhập loại động vật.");
      return;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setCreateError("Vui lòng nhập tọa độ hợp lệ.");
      return;
    }

    let mediaIds: string[] | undefined;

    try {
      setCreateSending(true);
      mediaIds = await uploadSelectedImages();
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
          `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        ]
          .filter(Boolean)
          .join(" - "),
        provinceCode: provinceCode || undefined,
        provinceName: provinceName || undefined,
        wardCode: wardCode || undefined,
        wardName: wardName || undefined,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
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
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onRegionChangeComplete={(region) => {
              setMapRegion(region);
              setViewportBounds(regionToBounds(region));
            }}
            onPress={() => {
              setSelectedMarkerId(null);
            }}
            onLongPress={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              void openCreateModal(latitude, longitude);
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
                  void loadMarkerDetail(marker);
                }}
              >
                <MapPinMarker source={marker.source} />
              </Marker>
            ))}
          </MapView>
        )}

        {/* Top Filters Bar */}
        <View className="absolute left-0 right-0 top-0">
          <View className="bg-card px-4 pb-3 border-b border-border shadow-sm">
            <View className="mt-3 flex-row gap-2">
              {FILTERS.map((item) => {
                const active = selectedFilters.has(item.key);
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => toggleFilter(item.key)}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full border px-3 py-2 ${
                      active
                        ? "border-primary bg-primary"
                        : "border-border bg-muted/40"
                    }`}
                  >
                    <Text className="text-sm">{item.emoji}</Text>
                    <Text
                      className={`text-[11px] font-extrabold uppercase tracking-wider ${
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
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
            className="absolute left-4 right-4 flex-row gap-2 items-center animate-fade-in"
            style={{ bottom: MAP_PANEL_HEIGHT + 12 }}
          >
            <View className="flex-1">
              <MapMarkerCard marker={selectedMarker} compact />
            </View>
            <Pressable
              onPress={() => void loadMarkerDetail(selectedMarker)}
              className="h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Xem chi tiết"
            >
              <Ionicons name="eye-outline" size={22} color="white" />
            </Pressable>
          </View>
        )}
      </View>

      <View className="absolute right-4 bottom-4 z-20">
        <Pressable
          onPress={() => setPanelVisible(true)}
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Bộ lọc nâng cao"
        >
          <Ionicons name="options-outline" size={24} color="white" />
        </Pressable>
      </View>

      <View className="absolute left-4 bottom-4 z-20">
        <Pressable
          onPress={() => {
            const centerLat =
              (viewportBounds.minLat + viewportBounds.maxLat) / 2;
            const centerLng =
              (viewportBounds.minLng + viewportBounds.maxLng) / 2;
            void openCreateModal(centerLat, centerLng);
          }}
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-green-600 shadow-lg active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Báo cứu hộ mới"
        >
          <Ionicons name="add" size={28} color="white" />
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

      {/* Form Modal Tạo báo cáo Cứu hộ mới */}
      <Modal
        transparent
        visible={createVisible}
        animationType="slide"
        onRequestClose={closeCreateModal}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={closeCreateModal} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="max-h-[92%] rounded-t-[30px] bg-card border-t border-border"
          >
            <ScrollView
              className="px-4 pt-4 pb-6"
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center pb-2">
                <View className="h-1.5 w-12 rounded-full bg-muted" />
              </View>

              <View className="mb-4 flex-row items-center justify-between border-b border-border/30 pb-2">
                <View>
                  <Text className="text-xl font-black text-foreground">
                    🆘 Báo cứu hộ mới
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    GPS tự động điền địa chỉ, nhấn giữ map để lấy vị trí
                  </Text>
                </View>
                <Pressable
                  onPress={closeCreateModal}
                  className="h-8 w-8 items-center justify-center rounded-full bg-muted/60"
                >
                  <Ionicons
                    name="close"
                    size={18}
                    className="text-muted-foreground"
                  />
                </Pressable>
              </View>

              {/* Basic Info Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Thông tin cơ bản
                </Text>

                <FormField label="Loại động vật" required>
                  <Input
                    value={createTitle}
                    onChangeText={setCreateTitle}
                    placeholder="Ví dụ: Chó, Mèo, Chim..."
                  />
                </FormField>

                <FormField label="Mô tả chi tiết">
                  <Input
                    value={createDescription}
                    onChangeText={setCreateDescription}
                    placeholder="Mô tả tình trạng, địa điểm, hành vi..."
                    multiline
                  />
                </FormField>
              </View>

              {/* Appearance Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Đặc điểm
                </Text>

                <FormField label="Màu sắc">
                  <Input
                    value={createColor}
                    onChangeText={setCreateColor}
                    placeholder="Ví dụ: Trắng đen, Nâu..."
                  />
                </FormField>

                <FormField label="Mức ưu tiên">
                  <View className="flex-row gap-2 mt-1">
                    {PRIORITIES.map((p) => (
                      <Pressable
                        key={p}
                        onPress={() => setCreatePriority(p)}
                        className={`flex-1 items-center rounded-xl py-2.5 border ${
                          createPriority === p
                            ? "bg-primary border-primary"
                            : "border-border bg-muted/20"
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
                </FormField>
              </View>

              {/* Photos Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Ảnh minh họa
                </Text>

                <Pressable
                  onPress={() => void pickImage()}
                  className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-6"
                >
                  <Ionicons
                    name="camera"
                    size={18}
                    className="text-muted-foreground mr-2"
                  />
                  <Text className="text-center font-bold text-foreground text-sm">
                    Thêm ảnh từ thư viện
                  </Text>
                </Pressable>

                {selectedImages.length > 0 && (
                  <View className="mt-4">
                    <Text className="mb-3 text-xs font-semibold text-muted-foreground">
                      Đã chọn ({selectedImages.length})
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
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
                            className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/60"
                          >
                            <Ionicons name="close" size={12} color="white" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Location Card with Searchable Select */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Vị trí
                </Text>

                <Select
                  label="Tỉnh/Thành phố"
                  required
                  valueName={provinceName}
                  placeholder="Chọn tỉnh..."
                  options={provincesList}
                  onSelect={(option) => {
                    setProvinceCode(option.code);
                    setProvinceName(option.name);
                    setWardCode("");
                    setWardName("");
                    setWardSearchRaw("");
                    void loadWardsForProvince(option.code);
                  }}
                  searchValue={provinceSearchRaw}
                  onSearchChange={setProvinceSearchRaw}
                />

                <Select
                  label="Phường/Xã"
                  required
                  valueName={wardName}
                  placeholder={
                    provinceCode ? "Chọn phường..." : "Vui lòng chọn tỉnh trước"
                  }
                  options={wardsList}
                  onSelect={(option) => {
                    setWardCode(option.code);
                    setWardName(option.name);
                  }}
                  searchValue={wardSearchRaw}
                  onSearchChange={setWardSearchRaw}
                  disabled={!provinceCode}
                  loading={loadingWards}
                />

                {(provinceName || wardName) && (
                  <View className="mb-4 rounded-xl bg-primary/10 p-3 flex-row items-center">
                    <Ionicons
                      name="pin"
                      size={14}
                      className="text-primary mr-2"
                    />
                    <Text className="text-xs font-bold text-primary flex-1">
                      Địa điểm:{" "}
                      {[wardName, provinceName].filter(Boolean).join(", ")}
                    </Text>
                  </View>
                )}

                <View className="flex-row gap-2 mt-2">
                  <FormField label="Vĩ độ (Lat)" className="flex-1 mb-0">
                    <Input
                      value={createLat}
                      onChangeText={setCreateLat}
                      keyboardType="numeric"
                      placeholder="0.000000"
                    />
                  </FormField>
                  <FormField label="Kinh độ (Lng)" className="flex-1 mb-0">
                    <Input
                      value={createLng}
                      onChangeText={setCreateLng}
                      keyboardType="numeric"
                      placeholder="0.000000"
                    />
                  </FormField>
                </View>
              </View>

              {/* Contact Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Liên hệ
                </Text>

                <FormField label="Số điện thoại liên hệ" className="mb-0">
                  <Input
                    value={createContact}
                    onChangeText={setCreateContact}
                    keyboardType="phone-pad"
                    placeholder="Nhập số điện thoại"
                    left={
                      <Ionicons
                        name="call"
                        size={16}
                        className="text-muted-foreground"
                      />
                    }
                  />
                </FormField>
              </View>

              {/* Error Message */}
              {createError && (
                <View className="mb-4 rounded-xl bg-destructive/10 px-3 py-2.5 flex-row items-center">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    className="text-destructive mr-2"
                  />
                  <Text className="text-xs font-bold text-destructive flex-1">
                    {createError}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={closeCreateModal}
                  className="flex-1 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 py-3.5"
                >
                  <Text className="font-bold text-foreground">Hủy</Text>
                </Pressable>

                <Pressable
                  onPress={() => void submitRescue()}
                  disabled={createSending}
                  className="flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3.5 active:opacity-90"
                >
                  {createSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-bold text-white">Gửi báo cứu hộ</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Chi tiết Marker Modal */}
      <Modal
        transparent
        visible={markerDetailVisible}
        animationType="fade"
        onRequestClose={() => setMarkerDetailVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50 px-4 py-6">
          <View className="max-h-[90%] overflow-hidden rounded-[26px] bg-card border border-border">
            <ScrollView showsVerticalScrollIndicator={false}>
              {markerDetailLoading ? (
                <View className="items-center justify-center py-12">
                  <ActivityIndicator size="large" />
                </View>
              ) : markerDetailError ? (
                <View className="items-center justify-center p-6">
                  <Text className="text-center text-sm text-destructive font-bold">
                    {markerDetailError}
                  </Text>
                </View>
              ) : markerDetail ? (
                <>
                  {/* Images Section */}
                  {detailImages.length > 0 ? (
                    <View>
                      {detailImages.length > 1 ? (
                        <View className="flex-row flex-wrap gap-1.5 bg-muted/20 p-4">
                          {detailImages
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
                      ) : (
                        <View className="p-4 pb-0">
                          <ExpoImage
                            source={{ uri: detailImages[0] }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 12,
                            }}
                            contentFit="cover"
                          />
                        </View>
                      )}
                    </View>
                  ) : null}

                  {/* Header Section */}
                  <View className="border-b border-border/50 px-4 py-4">
                    <Text className="text-lg font-black text-foreground">
                      {"Chi ti\u1ebft"}
                    </Text>
                    <Text className="mt-1 text-xs text-muted-foreground">
                      {selectedMarker?.source === "rescue"
                        ? "Thông tin chi tiết vụ cứu hộ động vật"
                        : "Thông tin chi tiết tổ chức"}
                    </Text>
                  </View>

                  {/* Details Section */}
                  <View className="p-4">
                    {detailRows.map((row, idx) => (
                      <View
                        key={row.label}
                        className={`border-b border-border/30 py-3 ${
                          idx === detailRows.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {row.label}
                        </Text>
                        <Text className="mt-1 text-sm font-semibold text-foreground leading-5">
                          {row.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </ScrollView>

            {/* Footer Buttons */}
            <View className="border-t border-border/50 bg-card px-4 py-3 flex-row gap-3">
              <Pressable
                onPress={() => setMarkerDetailVisible(false)}
                className="flex-1 items-center justify-center rounded-xl bg-muted/60 py-3 active:bg-muted"
              >
                <Text className="font-bold text-foreground text-sm">Đóng</Text>
              </Pressable>
              {/* {canCompleteRescue && ( */}
              <Pressable
                onPress={openCompleteModal}
                className="flex-1 items-center justify-center rounded-xl bg-green-600 py-3 active:opacity-90"
              >
                <Text className="font-bold text-white text-sm">Hoàn thành</Text>
              </Pressable>
              {/* )} */}
            </View>
          </View>
        </View>
      </Modal>

      {/* Form Modal Hoàn thành Cứu hộ */}
      <Modal
        transparent
        visible={completeVisible}
        animationType="slide"
        onRequestClose={() => setCompleteVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="flex-1"
            onPress={() => setCompleteVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="max-h-[92%] rounded-t-[30px] bg-card border-t border-border"
          >
            <ScrollView
              className="px-4 pt-4 pb-6"
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center pb-2">
                <View className="h-1.5 w-12 rounded-full bg-muted" />
              </View>

              <View className="mb-4 flex-row items-center justify-between border-b border-border/30 pb-2">
                <View>
                  <Text className="text-xl font-black text-foreground">
                    🏁 Hoàn thành ca cứu hộ
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    Cung cấp thông tin xác minh để hoàn thành cứu hộ
                  </Text>
                </View>
                <Pressable
                  onPress={() => setCompleteVisible(false)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-muted/60"
                >
                  <Ionicons
                    name="close"
                    size={18}
                    className="text-muted-foreground"
                  />
                </Pressable>
              </View>

              {/* Photos Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Ảnh xác minh *
                </Text>

                <Pressable
                  onPress={() => void pickCompleteImage()}
                  className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-6"
                >
                  <Ionicons
                    name="camera"
                    size={18}
                    className="text-muted-foreground mr-2"
                  />
                  <Text className="text-center font-bold text-foreground text-sm">
                    Thêm ảnh từ thư viện
                  </Text>
                </Pressable>

                {completeImages.length > 0 && (
                  <View className="mt-4">
                    <Text className="mb-3 text-xs font-semibold text-muted-foreground">
                      Đã chọn ({completeImages.length})
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {completeImages.map((image, index) => (
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
                            onPress={() => removeCompleteImage(index)}
                            className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/60"
                          >
                            <Ionicons name="close" size={12} color="white" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Completion Notes Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <Text className="mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Ghi chú hoàn thành
                </Text>

                <FormField label="Chi tiết cứu hộ">
                  <Input
                    value={completeNote}
                    onChangeText={setCompleteNote}
                    placeholder="Mô tả lại quá trình cứu hộ, tình trạng sức khỏe hiện tại của bé..."
                    multiline
                  />
                </FormField>

                <FormField label="Ghi chú vị trí bàn giao">
                  <Input
                    value={completeLocationNote}
                    onChangeText={setCompleteLocationNote}
                    placeholder="Nhập địa chỉ hoặc ghi chú vị trí đưa bé đến (ví dụ: Phòng khám thú y X)..."
                  />
                </FormField>
              </View>

              {/* Confirmation Card */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4 flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-sm font-bold text-foreground">
                    Xác nhận cứu hộ thành công
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Tôi xác nhận rằng thú cưng đã được cứu hộ an toàn và đúng
                    thực tế.
                  </Text>
                </View>
                <Switch
                  value={completeConfirmRescued}
                  onValueChange={setCompleteConfirmRescued}
                  trackColor={{ false: "rgb(210 210 210)", true: "#16a34a" }}
                  thumbColor="white"
                />
              </View>

              {/* Error Message */}
              {completeError && (
                <View className="mb-4 rounded-xl bg-destructive/10 px-3 py-2.5 flex-row items-center">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    className="text-destructive mr-2"
                  />
                  <Text className="text-xs font-bold text-destructive flex-1">
                    {completeError}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setCompleteVisible(false)}
                  className="flex-1 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 py-3.5"
                >
                  <Text className="font-bold text-foreground">Hủy</Text>
                </Pressable>

                <Pressable
                  onPress={() => void handleRescueComplete()}
                  disabled={completeSending}
                  className="flex-1 items-center justify-center rounded-xl bg-green-600 px-4 py-3.5 active:opacity-90"
                >
                  {completeSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-bold text-white">
                      Xác nhận hoàn thành
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const MapPinMarker = ({ source }: { source: MapSourceKey }) => {
  const iconSource =
    source === "rescue" ? MARKER_ICONS.rescue : MARKER_ICONS.center;

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
