import type { CreateRescueCaseRequestDto } from "@/src/infrastructure/api/generated/model";
import { report } from "@/src/infrastructure/api/generated/pet-rescue-api";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NewRescueScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Vui lòng nhập tọa độ hợp lệ.");
      return;
    }

    const payload: CreateRescueCaseRequestDto = {
      species: title.trim(),
      description: description.trim() || undefined,
      latitude: lat,
      longitude: lng,
      locationText: `Lat ${lat}, Lng ${lng}`,
    };

    try {
      setSending(true);
      await report(payload);
      router.back();
    } catch {
      setError("Không gửi được báo cứu hộ. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Stack.Screen options={{ title: "Báo cứu hộ mới" }} />

      <View className="mt-4">
        <Text className="mb-2 text-sm font-semibold">Tiêu đề</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ví dụ: Chó bị lạc"
          className="mb-4 rounded-md border border-border px-3 py-2 text-foreground"
        />

        <Text className="mb-2 text-sm font-semibold">Chi tiết</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Thông tin chi tiết về vị trí, tình trạng"
          multiline
          className="min-h-[120px] rounded-md border border-border px-3 py-2 text-foreground"
        />

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-sm font-semibold">Latitude</Text>
            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
              placeholder="21.0285"
              className="rounded-md border border-border px-3 py-2 text-foreground"
            />
          </View>

          <View className="flex-1">
            <Text className="mb-2 text-sm font-semibold">Longitude</Text>
            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
              placeholder="105.8342"
              className="rounded-md border border-border px-3 py-2 text-foreground"
            />
          </View>
        </View>

        {error ? (
          <Text className="mt-3 text-sm text-destructive">{error}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={sending}
          className="mt-4 items-center rounded-full bg-primary px-4 py-3"
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-bold text-primary-foreground">
              Gửi báo cứu hộ
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
