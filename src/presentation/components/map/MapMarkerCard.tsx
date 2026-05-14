import type { MapMarker } from "@/src/domain/entities/map";
import { MAP_SOURCE_CONFIGS } from "@/src/presentation/constants/map-config";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  marker: MapMarker;
  compact?: boolean;
  onPress?: () => void;
};

export function MapMarkerCard({ marker, compact = false, onPress }: Props) {
  const source = MAP_SOURCE_CONFIGS[marker.source];

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        className="rounded-2xl border border-border bg-card p-3"
      >
        <View className="flex-row items-start gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: source.tint }}
          >
            <Feather name="map-pin" size={18} color={source.color} />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">
              {marker.title}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              {marker.description ?? "Không có mô tả"}
            </Text>

            <View className="mt-2 flex-row flex-wrap gap-2">
              <Badge label={source.label} tone={source.color} />
              {marker.subtitle ? <Badge label={marker.subtitle} /> : null}
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: source.tint }}
          >
            <Feather name="map-pin" size={20} color={source.color} />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">
              {marker.title}
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              {marker.description ?? "Không có mô tả"}
            </Text>

            <View className="mt-3 flex-row flex-wrap gap-2">
              <Badge
                label={`${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}`}
              />
              <Badge label={source.label} tone={source.color} />
              {marker.subtitle ? <Badge label={marker.subtitle} /> : null}
              {marker.status ? <Badge label={marker.status} /> : null}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const Badge = ({ label, tone }: { label: string; tone?: string }) => {
  return (
    <View
      className="rounded-full px-3 py-1.5"
      style={{ backgroundColor: tone ? `${tone}18` : "rgb(244 244 245)" }}
    >
      <Text
        className="text-[11px] font-semibold"
        style={{ color: tone ? tone : "rgb(113 113 122)" }}
      >
        {label}
      </Text>
    </View>
  );
};
