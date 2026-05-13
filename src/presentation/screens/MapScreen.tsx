import MapView, { Marker, type Region } from "react-native-maps";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  DEFAULT_MAP_BOUNDS,
  DEFAULT_MAP_SOURCE,
  MAP_PANEL_HEIGHT,
  MAP_SOURCE_CONFIGS,
  MAP_VIEWPORT,
  type MapBounds,
  type MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { useMapMarkers } from "@/src/presentation/hooks/use-map-markers";
import { MapSidebar } from "@/src/presentation/components/map/MapSidebar";
import { MapMarkerCard } from "@/src/presentation/components/map/MapMarkerCard";
import { MapSourceToggle } from "@/src/presentation/components/map/MapSourceToggle";

const FILTERS: {[]
  key: MapSourceKey | "all";
  label: string;
  emoji: string;
}> = [
  { key: "all", label: "Tất cả", emoji: "🗺️" },
  { key: "rescue", label: "Cần cứu hộ", emoji: "🆘" },
  { key: "organization", label: "Trung tâm", emoji: "🏥" },
];

const regionToBounds = (region: Region): MapBounds => ({
  minLat: region.latitude - region.latitudeDelta / 2,
  minLng: region.longitude - region.longitudeDelta / 2,
  maxLat: region.latitude + region.latitudeDelta / 2,
  maxLng: region.longitude + region.longitudeDelta / 2,
});

export default function MapScreen() {
  const router = useRouter();

  const [source, setSource] = useState<MapSourceKey>(DEFAULT_MAP_SOURCE);
  const [filter, setFilter] = useState<MapSourceKey | "all">("all");
  const [viewportBounds, setViewportBounds] =
    useState<MapBounds>(DEFAULT_MAP_BOUNDS);
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | undefined>(
    undefined,
  );
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const {
    data: markers = [],
    isLoading,
    error,
  } = useMapMarkers({
    source: filter === "all" ? "all" : source,
    bounds: appliedBounds,
  });

  const visibleMarkers = useMemo(() => {
    if (filter === "all") {
      return markers;
    }
    return markers.filter((marker) => marker.source === filter);
  }, [filter, markers]);

  const selectedMarker = useMemo(
    () => markers.find((item) => item.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId],
  );

  const mapRegion: Region = {
    latitude: MAP_VIEWPORT.latitude,
    longitude: MAP_VIEWPORT.longitude,
    latitudeDelta: MAP_VIEWPORT.latitudeDelta,
    longitudeDelta: MAP_VIEWPORT.longitudeDelta,
  };

  const isWeb = Platform.OS === "web";

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
            style={{ flex: 1 }}
            initialRegion={mapRegion}
            onRegionChangeComplete={(region) => {
              setViewportBounds(regionToBounds(region));
            }}
          >
            {visibleMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={() => setSelectedMarkerId(marker.id)}
              >
                <MapPinMarker source={marker.source} />
              </Marker>
            ))}
          </MapView>
        )}

        <View className="absolute left-0 right-0 top-0">
          <View className="bg-primary px-4 pb-3 pt-12">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-extrabold text-primary-foreground">
                  Bản đồ
                </Text>
                <Text className="text-xs text-primary-foreground/80">
                  Cứu hộ · Tổ chức · Sự kiện
                </Text>
              </View>

              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-[10px] font-bold text-white">
                  {visibleMarkers.length} điểm
                </Text>
              </View>
            </View>

            <View className="mt-3">
              <MapSourceToggle
                value={source}
                onChange={(next) => {
                  setSource(next);
                  setFilter(next);
                  setSelectedMarkerId(null);
                }}
              />
            </View>

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
            className="absolute left-4 right-4"
            style={{ bottom: MAP_PANEL_HEIGHT + 12 }}
          >
            <MapMarkerCard marker={selectedMarker} compact />
          </View>
        )}
      </View>

      <View className="absolute right-4 bottom-4 z-20">
        <Pressable
          onPress={() => setPanelVisible(true)}
          className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <Text className="text-lg text-primary-foreground">⚙️</Text>
        </Pressable>
      </View>

      <View className="absolute left-4 bottom-4 z-20">
        <Pressable
          onPress={() => router.push("/rescue/new")}
          className="h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg"
        >
          <Text className="text-lg text-white">＋</Text>
        </Pressable>
      </View>

      <View className="absolute left-0 right-0 bottom-0">
        <MapSidebar
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          source={source}
          onSourceChange={(next) => {
            setSource(next);
            setSelectedMarkerId(null);
          }}
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
      </View>
    </View>
  );
}

const MapPinMarker = ({ source }: { source: MapSourceKey }) => {
  const cfg = MAP_SOURCE_CONFIGS[source];

  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-full border-2 border-white"
      style={{
        backgroundColor: cfg.color,
        shadowColor: "#000",
        shadowOpacity: 0.28,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View className="h-4 w-4 items-center justify-center rounded-full bg-white/15">
        <Text className="text-[9px] font-black text-white">
          {source === "rescue" ? "SOS" : "H"}
        </Text>
      </View>
    </View>
  );
};
