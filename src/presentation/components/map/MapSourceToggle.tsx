import {
    MAP_SOURCE_CONFIGS,
    type MapSourceKey,
} from "@/src/presentation/constants/map-config";
import { Pressable, Text, View } from "react-native";

type Props = {
  value: MapSourceKey;
  onChange: (value: MapSourceKey) => void;
};

export function MapSourceToggle({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-2">
      {(Object.keys(MAP_SOURCE_CONFIGS) as MapSourceKey[]).map((key) => {
        const config = MAP_SOURCE_CONFIGS[key];
        const active = value === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={`flex-1 rounded-full border px-3 py-2 ${
              active ? "border-transparent" : "border-border"
            }`}
            style={{ backgroundColor: active ? config.color : config.tint }}
          >
            <Text
              className={`text-center text-xs font-bold ${
                active ? "text-white" : "text-foreground"
              }`}
            >
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
