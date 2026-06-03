import { useState } from "react";
import { queryClient } from "@/app/_layout";
import type { AdoptionPet } from "@/src/domain/entities/adoption-pet";
import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { fetchPetDetail } from "@/src/presentation/data/pet-api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View, Modal, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBar } from "@/components/ui/header-bar";
import { FormField, Input } from "@/components/ui";
import { submit as submitAdoptionApi } from "@/src/infrastructure/api/generated/pet-rescue-api";
import type { CreateAdoptionRequestDto } from "@/src/infrastructure/api/generated/model";

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 rounded-3xl bg-muted px-4 py-4">
    <Text className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label}
    </Text>
    <Text className="mt-2 text-base font-bold text-foreground">{value}</Text>
  </View>
);

const GradientButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={{
      borderRadius: 14,
      backgroundColor: "#0a4c73",
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
    }}
  >
    <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>{label}</Text>
  </TouchableOpacity>
);

const getSpeciesLabel = (pet: AdoptionPet) => {
  if (pet.species === "dog") return "Chó";
  if (pet.species === "cat") return "Mèo";
  if (pet.species === "bird") return "Chim";
  return "Thỏ";
};

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const initialPet = queryClient.getQueryData<AdoptionPet>(["pet-detail", id]);

  const detailQuery = useQuery({
    queryKey: ["pet-detail", id],
    queryFn: () => fetchPetDetail(id),
    initialData: initialPet,
  });

  const pet = detailQuery.data;

  const [adoptVisible, setAdoptVisible] = useState(false);
  const [experience, setExperience] = useState("");
  const [liveCondition, setLiveCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAdoptSubmit = async () => {
    if (!pet) return;
    setSubmitError(null);

    if (!experience.trim()) {
      setSubmitError("Vui lòng chia sẻ kinh nghiệm nuôi dưỡng.");
      return;
    }

    if (!liveCondition.trim()) {
      setSubmitError("Vui lòng mô tả điều kiện sống của bạn.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateAdoptionRequestDto = {
        petId: pet.id,
        organizationId: pet.organizationId || "",
        experience: experience.trim(),
        liveCondition: liveCondition.trim(),
      };

      await submitAdoptionApi(payload);

      Alert.alert(
        "Thành công",
        `Đơn đăng ký nhận nuôi bé ${pet.name} đã được gửi thành công!`,
        [
          {
            text: "OK",
            onPress: () => {
              setAdoptVisible(false);
              setExperience("");
              setLiveCondition("");
              router.push("/(tabs)/map");
            },
          },
        ]
      );
    } catch (err) {
      console.error("Error submitting adoption request:", err);
      setSubmitError("Không thể gửi đơn nhận nuôi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (detailQuery.isLoading && !pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-base font-semibold text-foreground">
          Không tìm thấy thông tin thú cưng.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <HeaderBar
        title="Chi tiết thú cưng"
        onBack={() => router.back()}
        rightSlot={
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Thông báo",
                "Chức năng yêu thích chưa được backend hỗ trợ trong app này.",
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Yêu thích"
            style={{
              height: 36,
              width: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <Ionicons name="heart-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <FastImage
          source={{ uri: pet.imageUrl }}
          style={{ width: "100%", height: 360 }}
        />

        <View className="-mt-8 rounded-t-[36px] bg-card px-5 pb-8 pt-6 shadow-soft-1">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-[28px] font-extrabold text-foreground">
                {pet.name}
              </Text>
              <Text className="mt-2 text-sm font-semibold text-primary">
                {pet.shelterName}
              </Text>
            </View>
            <View className="rounded-full bg-muted px-4 py-2">
              <Text className="text-xs font-bold text-foreground">
                {pet.badge}
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <InfoTile label="Tuổi" value={pet.ageLabel} />
            <InfoTile label="Loài" value={getSpeciesLabel(pet)} />
          </View>

          <View className="mt-5">
            <Text className="text-sm font-bold text-foreground">
              Tình trạng sức khỏe
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {pet.healthBadges.map((badge) => (
                <View
                  key={badge}
                  className="rounded-full bg-emerald-50 px-4 py-2"
                >
                  <Text className="text-xs font-semibold text-emerald-700">
                    {badge}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6 rounded-[28px] bg-muted px-4 py-4">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={pet.gender === "male" ? "male" : "female"}
                size={16}
                color="#277f8f"
              />
              <Text className="text-sm font-semibold text-foreground">
                {pet.gender === "male" ? "Đực" : "Cái"}
              </Text>
              <Feather name="map-pin" size={15} color="#0a4c73" />
              <Text className="flex-1 text-sm text-muted-foreground">
                {pet.location}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-bold text-foreground">Mô tả</Text>
            <Text className="mt-3 text-[15px] leading-7 text-muted-foreground">
              {pet.description}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-bold text-foreground">
              Câu chuyện của bé
            </Text>
            <Text className="mt-3 text-[15px] leading-7 text-muted-foreground">
              {pet.story}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4"
        style={{
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom + 12, 20),
        }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Chat với shelter",
                "Luồng chat này chưa hỗ trợ.",
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Chat với shelter"
            className="h-14 w-14 items-center justify-center rounded-full border border-border bg-card"
          >
            <Feather name="message-circle" size={20} color="#0a4c73" />
          </TouchableOpacity>
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => setAdoptVisible(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Nhận nuôi bé ngay"
              style={{
                borderRadius: 0,
                backgroundColor: "#0a4c73",
                minHeight: 52,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>
                Nhận nuôi bé ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Form Modal Nhận Nuôi Thú Cưng */}
      <Modal
        transparent
        visible={adoptVisible}
        animationType="slide"
        onRequestClose={() => setAdoptVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="flex-1"
            onPress={() => setAdoptVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="max-h-[90%] rounded-t-[30px] bg-card border-t border-border"
          >
            <ScrollView
              className="px-4 pt-4 pb-6"
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center pb-2">
                <View className="h-1.5 w-12 rounded-full bg-muted" />
              </View>

              <View className="mb-4 flex-row items-center justify-between border-b border-border/30 pb-2">
                <View className="flex-1">
                  <Text className="text-xl font-black text-foreground">
                    📝 Đăng ký nhận nuôi {pet.name}
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    Vui lòng cung cấp đầy đủ thông tin để hoàn thiện hồ sơ
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setAdoptVisible(false)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-muted/60"
                >
                  <Ionicons
                    name="close"
                    size={18}
                    className="text-muted-foreground"
                  />
                </TouchableOpacity>
              </View>

              {/* Form Content */}
              <View className="mb-4 rounded-2xl border border-border bg-card p-4">
                <FormField label="Kinh nghiệm nuôi dưỡng" required>
                  <Input
                    value={experience}
                    onChangeText={setExperience}
                    placeholder="Bạn đã từng nuôi chó/mèo hay thú cưng khác chưa? Vui lòng chia sẻ ngắn gọn về kinh nghiệm của bạn..."
                    multiline
                    numberOfLines={4}
                    style={{ textAlignVertical: "top", minHeight: 96 }}
                  />
                </FormField>

                <FormField label="Điều kiện sống & gia đình" required>
                  <Input
                    value={liveCondition}
                    onChangeText={setLiveCondition}
                    placeholder="Không gian nhà ở (nhà riêng, chung cư, sân vườn...)? Các thành viên trong gia đình có đồng ý và hỗ trợ bạn chăm sóc bé không?..."
                    multiline
                    numberOfLines={4}
                    style={{ textAlignVertical: "top", minHeight: 96 }}
                  />
                </FormField>
              </View>

              {/* Error Message */}
              {submitError && (
                <View className="mb-4 rounded-xl bg-destructive/10 px-3 py-2.5 flex-row items-center">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    className="text-destructive mr-2"
                  />
                  <Text className="text-xs font-bold text-destructive flex-1">
                    {submitError}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setAdoptVisible(false)}
                  className="flex-1 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 py-3.5"
                >
                  <Text className="font-bold text-foreground">Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => void handleAdoptSubmit()}
                  disabled={isSubmitting}
                  className="flex-1 items-center justify-center rounded-xl bg-[#277f8f] px-4 py-3.5 active:opacity-90"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-bold text-white">
                      Gửi đơn đăng ký
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
