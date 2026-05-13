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

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border border-border bg-card ${
        compact ? "p-3" : "p-4"
      }`}
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
            <Badge
              label={`${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}`}
            />
            <Badge label={source.label} tone={source.color} />
            {marker.subtitle ? <Badge label={marker.subtitle} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const Badge = ({ label, tone }: { label: string; tone?: string }) => {
  return (
    <View
      className="rounded-full px-2 py-1"
      style={{ backgroundColor: tone ? `${tone}18` : undefined }}
    >
      <Text className="text-[10px] font-semibold text-muted-foreground">
        {label}
      </Text>
    </View>
  );
};
