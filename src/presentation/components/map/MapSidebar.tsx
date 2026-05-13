import type { MapMarker } from "@/src/domain/entities/map";
import {
  DEFAULT_MAP_BOUNDS,
  MAP_PANEL_HEIGHT,
  MAP_SOURCE_CONFIGS,
  type MapBounds,
  type MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MapMarkerCard } from "./MapMarkerCard";
import { MapSourceToggle } from "./MapSourceToggle";

type Props = {
  visible: boolean;
  onClose: () => void;
  source: MapSourceKey;
  onSourceChange: (value: MapSourceKey) => void;
  bounds?: MapBounds | null;
  viewportBounds: MapBounds;
  onApplyViewportBounds: () => void;
  markers: MapMarker[];
  loading: boolean;
  error?: string | null;
  onSelectMarker?: (marker: MapMarker) => void;
};

export function MapSidebar({
  visible,
  onClose,
  source,
  onSourceChange,
  bounds,
  viewportBounds,
  onApplyViewportBounds,
  markers,
  loading,
  error,
  onSelectMarker,
}: Props) {
  const [draft, setDraft] = useState<MapBounds>(
    bounds ?? viewportBounds ?? DEFAULT_MAP_BOUNDS,
  );

  useEffect(() => {
    setDraft(bounds ?? viewportBounds ?? DEFAULT_MAP_BOUNDS);
  }, [bounds, viewportBounds]);

  const sourceConfig = MAP_SOURCE_CONFIGS[source];

  const counts = useMemo(
    () => ({
      total: markers.length,
      rescue: markers.filter((item) => item.source === "rescue").length,
      organization: markers.filter((item) => item.source === "organization")
        .length,
    }),
    [markers],
  );

  const update = (key: keyof MapBounds, value: string) => {
    const parsed = Number(value);
    setDraft((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? parsed : prev[key],
    }));
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/30">
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="rounded-t-3xl border-t border-border bg-card px-4 pt-3"
          style={{ height: MAP_PANEL_HEIGHT }}
        >
          <View className="items-center pb-2">
            <View className="h-1.5 w-12 rounded-full bg-muted" />
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-foreground">
                Bộ lọc bản đồ
              </Text>
              <Text className="text-xs text-muted-foreground">
                {sourceConfig.label} · {counts.total} điểm hiển thị
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-muted"
            >
              <Feather name="x" size={16} color="#606479" />
            </Pressable>
          </View>

          <View className="mt-3">
            <MapSourceToggle value={source} onChange={onSourceChange} />
          </View>

          <View className="mt-3 rounded-2xl bg-muted/40 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Bounding Box
              </Text>
              <Text className="text-[11px] font-semibold text-muted-foreground">
                Theo khung đang nhìn
              </Text>
            </View>

            <View className="mt-3 gap-2">
              <InputRow
                label="Min Lat"
                value={String(draft?.minLat ?? "")}
                onChange={(text) => update("minLat", text)}
              />
              <InputRow
                label="Min Lng"
                value={String(draft?.minLng ?? "")}
                onChange={(text) => update("minLng", text)}
              />
              <InputRow
                label="Max Lat"
                value={String(draft?.maxLat ?? "")}
                onChange={(text) => update("maxLat", text)}
              />
              <InputRow
                label="Max Lng"
                value={String(draft?.maxLng ?? "")}
                onChange={(text) => update("maxLng", text)}
              />
            </View>

            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={onApplyViewportBounds}
                className="flex-1 rounded-full bg-primary px-4 py-3"
              >
                <Text className="text-center text-xs font-bold text-primary-foreground">
                  Lấy bbox khung hiện tại
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onSourceChange(source)}
                className="flex-1 rounded-full border border-border px-4 py-3"
              >
                <Text className="text-center text-xs font-bold text-foreground">
                  Giữ nguồn hiện tại
                </Text>
              </Pressable>
            </View>

            <View className="mt-3 flex-row items-center gap-2">
              <Feather name="crosshair" size={13} color={sourceConfig.color} />
              <Text className="text-[11px] text-muted-foreground">
                Khung hiện tại: Min({viewportBounds.minLat.toFixed(3)},{" "}
                {viewportBounds.minLng.toFixed(3)}) · Max(
                {viewportBounds.maxLat.toFixed(3)},{" "}
                {viewportBounds.maxLng.toFixed(3)})
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Kết quả
              </Text>
              {loading ? <ActivityIndicator size="small" /> : null}
            </View>

            {error ? (
              <View className="mt-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3">
                <Text className="text-xs text-destructive">{error}</Text>
              </View>
            ) : null}

            <ScrollView
              className="mt-2"
              contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            >
              {markers.map((marker) => (
                <MapMarkerCard
                  key={marker.id}
                  marker={marker}
                  compact
                  onPress={
                    onSelectMarker ? () => onSelectMarker(marker) : undefined
                  }
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const InputRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2">
      <Text className="w-14 text-[11px] font-semibold text-muted-foreground">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        className="flex-1 text-sm text-foreground"
        placeholder="0"
        placeholderTextColor="rgb(125 125 125)"
      />
    </View>
  );
};
