import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AdoptionSummary } from "@/src/domain/entities/adoption";
import { useMyAdoptions } from "@/src/presentation/hooks/use-my-adoptions";

const STATUS_LABELS: Record<AdoptionSummary["status"], string> = {
  PENDING: "Đang xét duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

const STATUS_STYLE: Record<
  AdoptionSummary["status"],
  { pill: string; text: string; accent: string }
> = {
  PENDING: {
    pill: "bg-orange-100",
    text: "text-orange-600",
    accent: "bg-orange-500",
  },
  APPROVED: {
    pill: "bg-emerald-100",
    text: "text-emerald-600",
    accent: "bg-emerald-500",
  },
  REJECTED: {
    pill: "bg-rose-100",
    text: "text-rose-600",
    accent: "bg-rose-500",
  },
  CANCELLED: {
    pill: "bg-muted",
    text: "text-muted-foreground",
    accent: "bg-muted-foreground",
  },
};

const STEPS = ["Gửi đơn", "Xét duyệt", "Kết quả"];

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getStepIndex = (status: AdoptionSummary["status"]) => {
  if (status === "PENDING") return 1;
  return 2;
};

const StatusPill = ({ status }: { status: AdoptionSummary["status"] }) => {
  const cfg = STATUS_STYLE[status];
  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2 py-1 ${cfg.pill}`}>
      <Feather name="clock" size={12} className={cfg.text} />
      <Text className={`text-[11px] font-bold ${cfg.text}`}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
};

const AdoptionCard = ({
  item,
  expanded,
  onToggle,
}: {
  item: AdoptionSummary;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const stepIndex = getStepIndex(item.status);
  const statusCfg = STATUS_STYLE[item.status];

  return (
    <View className="overflow-hidden rounded-2xl bg-card shadow-soft-1">
      <View className={`h-1 ${statusCfg.accent}`} />
      <View className="flex-row items-start justify-between gap-3 p-4">
        <View className="flex-1 flex-row gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Feather name="heart" size={18} className="text-primary" />
          </View>
          <View className="flex-1">
            <View className="mb-1 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-accent px-2 py-1">
                <Text className="text-[10px] font-bold text-accent-foreground">
                  🐾 Nhận nuôi
                </Text>
              </View>
              <StatusPill status={item.status} />
            </View>
            <Text className="text-sm font-bold text-foreground" numberOfLines={2}>
              {item.petName ?? "Chưa có tên thú cưng"}
            </Text>
            <Text className="text-[11px] text-muted-foreground">
              Mã hồ sơ: {item.adoptionCode ?? "Đang cập nhật"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onToggle}
          className="h-8 w-8 items-center justify-center rounded-xl bg-muted"
        >
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            className="text-muted-foreground"
          />
        </TouchableOpacity>
      </View>

      {expanded ? (
        <View className="border-t border-border px-4 pb-4">
          <View className="flex-row items-center justify-between pt-4">
            <Text className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Tiến trình
            </Text>
            <Text className="text-[10px] text-muted-foreground">
              Nộp lúc {formatDate(item.createdAt)}
            </Text>
          </View>

          <View className="mt-3 gap-1">
            {STEPS.map((step, index) => {
              const isDone = index < stepIndex || item.status === "APPROVED";
              const isActive = index === stepIndex && item.status === "PENDING";
              const isRejected = item.status === "REJECTED" && index === stepIndex;
              const dotClass = isRejected
                ? "bg-rose-500"
                : isDone
                ? "bg-emerald-500"
                : isActive
                ? "bg-orange-500"
                : "bg-muted";

              const textClass = isRejected
                ? "text-rose-600"
                : isDone
                ? "text-emerald-600"
                : isActive
                ? "text-orange-600"
                : "text-muted-foreground";

              return (
                <View key={step} className="flex-row gap-3">
                  <View className="items-center">
                    <View className={`h-6 w-6 items-center justify-center rounded-full ${dotClass}`}>
                      {isDone ? (
                        <Feather name="check" size={12} className="text-white" />
                      ) : isRejected ? (
                        <Feather name="x" size={12} className="text-white" />
                      ) : (
                        <Text className="text-[10px] font-bold text-white">
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    {index < STEPS.length - 1 ? (
                      <View className={`mt-1 h-6 w-0.5 ${isDone ? dotClass : "bg-muted"}`} />
                    ) : null}
                  </View>
                  <View className="flex-1 pb-4">
                    <Text className={`text-[13px] font-semibold ${textClass}`}>
                      {step}
                    </Text>
                    {isActive ? (
                      <View className="mt-1 flex-row items-center gap-2">
                        <View className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                        <Text className={`text-[10px] ${textClass}`}>Đang xử lý...</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>

          <View className="mt-2 gap-2 rounded-xl bg-muted p-3">
            <View className="flex-row items-center gap-2">
              <Feather name="info" size={14} className="text-muted-foreground" />
              <Text className="text-[11px] text-muted-foreground">
                Kinh nghiệm: {item.experience ?? "Chưa cung cấp"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="home" size={14} className="text-muted-foreground" />
              <Text className="text-[11px] text-muted-foreground">
                Điều kiện sống: {item.liveCondition ?? "Chưa cung cấp"}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {item.petPrimaryImageUrl ? (
        <Image
          source={{ uri: item.petPrimaryImageUrl }}
          className="h-36 w-full"
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
};

export default function MyAdoptionsScreen() {
  const [filter, setFilter] = useState<"all" | AdoptionSummary["status"]>("all");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const { data, loading, refreshing, error, counts, refresh } = useMyAdoptions();

  const filtered = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((item) => item.status === filter);
  }, [data, filter]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary px-4 pb-3 pt-12">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} className="text-white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-primary-foreground">
              📋 Hồ sơ nhận nuôi
            </Text>
            <Text className="text-xs text-primary-foreground/80">
              Theo dõi trạng thái đơn của bạn
            </Text>
          </View>
          <TouchableOpacity
            onPress={refresh}
            className="h-9 w-9 items-center justify-center rounded-full bg-white/20"
          >
            <Feather name="refresh-cw" size={16} className="text-white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 6, gap: 8 }}
        >
          {([
            { key: "all", label: "Tất cả" },
            { key: "PENDING", label: "⏳ Chờ duyệt" },
            { key: "APPROVED", label: "✅ Đã duyệt" },
            { key: "REJECTED", label: "❌ Từ chối" },
            { key: "CANCELLED", label: "⏹ Đã hủy" },
          ] as const).map((item) => {
            const isActive = filter === item.key;
            const count = counts[item.key as keyof typeof counts];
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setFilter(item.key as typeof filter)}
                className={`rounded-full px-3 py-1.5 ${
                  isActive ? "bg-primary-foreground" : "bg-white/20"
                }`}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    isActive ? "text-primary" : "text-primary-foreground"
                  }`}
                >
                  {item.label}{count ? ` (${count})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator />
          <Text className="text-sm font-semibold text-muted-foreground">
            Đang tải hồ sơ...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 14 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          {error ? (
            <View className="items-center gap-2 rounded-2xl bg-card p-5">
              <Feather name="alert-circle" size={28} className="text-muted-foreground" />
              <Text className="text-sm font-semibold text-foreground">
                {error}
              </Text>
              <TouchableOpacity className="mt-2 rounded-full border border-primary px-4 py-2" onPress={refresh}>
                <Text className="text-xs font-bold text-primary">Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!error && filtered.length === 0 ? (
            <View className="items-center gap-2 rounded-2xl bg-card p-5">
              <Feather name="file-text" size={32} className="text-muted-foreground" />
              <Text className="text-sm font-semibold text-foreground">
                Chưa có hồ sơ nhận nuôi
              </Text>
              <Text className="text-xs text-muted-foreground">
                Hãy gửi đơn nhận nuôi để bắt đầu hành trình mới.
              </Text>
            </View>
          ) : null}

          {filtered.map((item) => (
            <AdoptionCard
              key={item.applicationId}
              item={item}
              expanded={Boolean(expandedIds[item.applicationId])}
              onToggle={() => toggleExpanded(item.applicationId)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
