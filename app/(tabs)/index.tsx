import { View } from "react-native";

export default function AboutScreen() {
  return <View className="bg-primary"></View>;
}

function AuthenticatedFeed() {
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const feedQuery = useQuery({
    queryKey: ["community-feed"],
    queryFn: () => fetchFeedPosts({ size: 10 }),
  });
  const posts = feedQuery.data?.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 108 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: HOME_TOKENS.spacing.screenX,
            paddingTop: HOME_TOKENS.spacing.top,
          }}
        >
          <View
            style={{
              borderRadius: HOME_TOKENS.radius.hero,
              backgroundColor: primaryColor,
              paddingHorizontal: 18,
              paddingTop: 16,
              paddingBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 22, marginRight: 8 }}>🐾</Text>
                  <Text style={{ color: "white", fontSize: 28, fontWeight: "800" }}>Cộng đồng</Text>
                </View>
                <Text style={{ color: "rgba(246,252,252,0.8)", fontSize: 12, marginTop: 4 }}>
                  Hanoi Pet Adoption
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => router.push("/adoption")}
                  accessibilityRole="button"
                  accessibilityLabel="Tìm kiếm"
                  style={circleButtonStyle("rgba(255,255,255,0.14)")}
                >
                  <Ionicons name="search" size={18} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/news")}
                  accessibilityRole="button"
                  accessibilityLabel="Thông báo"
                  style={circleButtonStyle("rgba(255,255,255,0.14)")}
                >
                  <Ionicons name="notifications-outline" size={18} color="white" />
                  <View style={notificationDotStyle} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingTop: 14 }}
            >
              {FEED_FILTERS.map((filter) => (
                <Pressable
                  key={filter.label}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: HOME_TOKENS.radius.pill,
                    backgroundColor: filter.active ? "white" : "rgba(255,255,255,0.14)",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons
                    name={filter.icon}
                    size={14}
                    color={filter.active ? primaryColor : "rgba(246,252,252,0.95)"}
                  />
                  <Text
                    style={{
                      marginLeft: 6,
                      color: filter.active ? primaryColor : "white",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={{ marginTop: 14, gap: 14 }}>
            {feedQuery.isLoading ? (
              <View
                style={{
                  borderRadius: HOME_TOKENS.radius.card,
                  backgroundColor: cardColor,
                  paddingVertical: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  ...HOME_TOKENS.shadow,
                }}
              >
                <ActivityIndicator color={primaryColor} />
              </View>
            ) : null}

            {!feedQuery.isLoading && posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                cardColor={cardColor}
                textColor={textColor}
                mutedColor={mutedColor}
                borderColor={borderColor}
              />
            ))}

            {!feedQuery.isLoading && posts.length === 0 ? (
              <View
                style={{
                  borderRadius: HOME_TOKENS.radius.card,
                  backgroundColor: cardColor,
                  paddingVertical: 24,
                  paddingHorizontal: 18,
                  ...HOME_TOKENS.shadow,
                }}
              >
                <Text style={{ color: textColor, fontSize: 15, fontWeight: "700" }}>
                  Chưa có bài viết cộng đồng.
                </Text>
                <Text style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>
                  Feed sẽ hiển thị dữ liệu thật từ API khi có bài đăng.
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/post/create")}
        accessibilityRole="button"
        accessibilityLabel="Thêm bài post mới"
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 58,
          height: 58,
          borderRadius: HOME_TOKENS.radius.pill,
          backgroundColor: primaryColor,
          alignItems: "center",
          justifyContent: "center",
          ...HOME_TOKENS.shadow,
        }}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}

function FeedCard({
  post,
  cardColor,
  textColor,
  mutedColor,
  borderColor,
}: {
  post: FeedPostViewModel;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
}) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/post/[id]", params: { id: post.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Bài viết ${post.author}`}
      style={{
        borderRadius: HOME_TOKENS.radius.card,
        backgroundColor: cardColor,
        overflow: "hidden",
        ...HOME_TOKENS.shadow,
      }}
    >
      {post.urgent ? (
        <View
          style={{
            backgroundColor: "#ff8250",
            paddingHorizontal: 12,
            paddingVertical: 7,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="alert-circle" size={14} color="white" />
          <Text style={{ color: "white", fontSize: 12, fontWeight: "800", marginLeft: 6 }}>
            KHẨN CẤP - Cần hỗ trợ ngay
          </Text>
        </View>
      ) : null}

      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: HOME_TOKENS.radius.pill,
              backgroundColor: post.urgent ? "#44b882" : "#2596d6",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>{post.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: textColor, fontSize: 17, fontWeight: "800" }}>{post.author}</Text>
              <View
                style={{
                  marginLeft: 8,
                  borderRadius: HOME_TOKENS.radius.pill,
                  backgroundColor: `${post.statusColor}22`,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: post.statusColor, fontSize: 10, fontWeight: "700" }}>{post.status}</Text>
              </View>
            </View>
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 3 }}>{post.time}</Text>
          </View>
        </View>

        <Text style={{ color: textColor, fontSize: 15, lineHeight: 22, marginTop: 12 }}>{post.title}</Text>

        {post.imageUrl ? (
          <FastImage
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: 240,
              borderRadius: 18,
              marginTop: 12,
            }}
          />
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Ionicons name="location-outline" size={14} color={mutedColor} />
          <Text style={{ color: mutedColor, fontSize: 12, marginLeft: 6 }}>{post.location}</Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {post.tags.map((tag) => (
            <View
              key={tag}
              style={{
                borderRadius: HOME_TOKENS.radius.pill,
                backgroundColor: "rgba(37,150,214,0.10)",
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#2596d6", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FeedMeta icon="heart-outline" value={post.comments} mutedColor={mutedColor} />
          <FeedMeta icon="chatbubble-outline" value={post.likes} mutedColor={mutedColor} />
          <Pressable
            onPress={() => router.push({ pathname: "/post/[id]", params: { id: post.id } })}
            style={{
              marginLeft: "auto",
              borderRadius: HOME_TOKENS.radius.pill,
              backgroundColor: "#ff6f61",
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>{post.cta}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function FeedMeta({
  icon,
  value,
  mutedColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: number;
  mutedColor: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 18 }}>
      <Ionicons name={icon} size={16} color={mutedColor} />
      <Text style={{ color: mutedColor, fontSize: 12, marginLeft: 6 }}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const textColor = useThemeColor({}, "text");

  return (
    <Text
      style={{
        marginTop: HOME_TOKENS.spacing.section,
        color: textColor,
        fontSize: 21,
        fontWeight: "800",
      }}
    >
      {title}
    </Text>
  );
}

function ActionCard({
  icon,
  title,
  description,
  surface,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  surface: string;
  onPress: () => void;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flex: 1,
        borderRadius: HOME_TOKENS.radius.card,
        backgroundColor: cardColor,
        paddingHorizontal: 12,
        paddingVertical: 14,
        ...HOME_TOKENS.shadow,
      }}
    >
      <View style={iconSurfaceStyle(surface)}>{icon}</View>
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "700", marginTop: 10 }}>{title}</Text>
      <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 17, marginTop: 6 }}>{description}</Text>
    </Pressable>
  );
}

function FeaturedPetCard({
  pet,
  cardColor,
  mutedColor,
}: {
  pet: AdoptionPet;
  cardColor: string;
  mutedColor: string;
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={() => router.push("/adoption")}
      accessibilityRole="button"
      accessibilityLabel={`Thú cưng ${pet.name}`}
      style={{
        width: 174,
        borderRadius: 22,
        backgroundColor: cardColor,
        overflow: "hidden",
        ...HOME_TOKENS.shadow,
      }}
    >
      <View>
        <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 132 }} />
        <View
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            borderRadius: HOME_TOKENS.radius.pill,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
            {pet.species === "dog" ? "Chó" : pet.species === "cat" ? "Mèo" : "Khác"}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: HOME_TOKENS.radius.pill,
            backgroundColor: "rgba(255,255,255,0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={pet.favorite ? "heart" : "heart-outline"}
            size={15}
            color={pet.favorite ? "#d46474" : mutedColor}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
        <Text style={{ color: textColor, fontSize: 20, fontWeight: "800" }}>{pet.name}</Text>
        <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>
          {pet.adult ? "Trưởng thành" : "Chưa trưởng thành"}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <View
            style={{
              borderRadius: HOME_TOKENS.radius.pill,
              backgroundColor: "rgba(95,185,92,0.12)",
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: "#5fb95c", fontSize: 10, fontWeight: "700" }}>
              {pet.vaccinated ? "Tiêm phòng" : "Cần tiêm"}
            </Text>
          </View>
          <Ionicons name={pet.gender === "male" ? "male" : "female"} size={14} color="#d46474" />
        </View>
      </View>
    </Pressable>
  );
}

function LocationPill({ text }: { text: string }) {
  return (
    <View
      style={{
        marginTop: 16,
        borderRadius: HOME_TOKENS.radius.pill,
        backgroundColor: "rgba(255,255,255,0.14)",
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicons name="location-outline" size={16} color="rgba(246,252,252,0.9)" />
      <Text style={{ color: "rgba(246,252,252,0.9)", fontSize: 13, marginLeft: 8 }}>{text}</Text>
    </View>
  );
}

function circleButtonStyle(backgroundColor: string) {
  return {
    width: 34,
    height: 34,
    borderRadius: HOME_TOKENS.radius.pill,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

function iconSurfaceStyle(backgroundColor: string) {
  return {
    width: 38,
    height: 38,
    borderRadius: HOME_TOKENS.radius.inner,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

const notificationDotStyle = {
  position: "absolute" as const,
  top: 7,
  right: 8,
  width: 7,
  height: 7,
  borderRadius: HOME_TOKENS.radius.pill,
  backgroundColor: "#ff8c38",
};
