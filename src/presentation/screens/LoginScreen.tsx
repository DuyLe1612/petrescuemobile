import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonText, Input, FormField } from "@/components/ui";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useLogin } from "@/src/presentation/hooks/use-login";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGIN_TOKENS = {
  radius: {
    card: 24,
    pill: 999,
  },
} as const;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate, isPending, error } = useLogin();
  const insets = useSafeAreaInsets();

  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 6 && !isPending;
  }, [email, password, isPending]);

  const onSubmit = () => {
    setFormError(null);

    if (email.trim().length === 0) {
      setFormError("Vui lòng nhập email hoặc tên người dùng.");
      return;
    }

    if (password.length < 6) {
      setFormError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    mutate(
      { emailOrUsername: email.trim(), password },
      {
        async onSuccess(data) {
          await tokenStorage.set(data.accessToken, data.refreshToken);
          router.replace("/(tabs)");
        },
        onError() {
          setFormError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
          console.error("Login failed");
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor }}
    >
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingBottom: Math.max(insets.bottom + 24, 32) }}>
          {/* Elegant header */}
          <View
            style={{
              backgroundColor: "#0a4c73",
              paddingTop: insets.top + 20,
              paddingBottom: 84,
              paddingHorizontal: 24,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              style={{
                width: 40,
                height: 40,
                borderRadius: LOGIN_TOKENS.radius.pill,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>

            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                }}
              >
                Đăng nhập
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Chào mừng bạn quay lại với Hanoi Pet Rescue.
              </Text>
            </View>
          </View>

          {/* Login Card */}
          <View
            style={{
              marginTop: -52,
              marginHorizontal: 20,
              borderRadius: LOGIN_TOKENS.radius.card,
              backgroundColor: cardColor,
              padding: 24,
              borderWidth: 1,
              borderColor: borderColor,
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            <View style={{ gap: 18 }}>
              <FormField label="Email hoặc tên người dùng" required>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nhapemail@gmail.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    height: 48,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: borderColor,
                    paddingHorizontal: 12,
                    backgroundColor: Platform.OS === "web" ? "transparent" : undefined,
                  }}
                  left={
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={mutedColor}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              </FormField>

              <FormField label="Mật khẩu" required>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  style={{
                    height: 48,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: borderColor,
                    paddingHorizontal: 12,
                    backgroundColor: Platform.OS === "web" ? "transparent" : undefined,
                  }}
                  left={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={mutedColor}
                      style={{ marginRight: 8 }}
                    />
                  }
                  right={
                    <Pressable
                      onPress={() => setShowPassword((value) => !value)}
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      hitSlop={12}
                      style={{ paddingHorizontal: 4 }}
                    >
                      <Text style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}>
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Text>
                    </Pressable>
                  }
                />
              </FormField>
            </View>

            {formError ? (
              <MessageBox
                text={formError}
                backgroundColor="rgba(239,68,68,0.06)"
                borderColor="rgba(239,68,68,0.15)"
                textColor="#ef4444"
              />
            ) : error ? (
              <MessageBox
                text="Đăng nhập thất bại. Vui lòng thử lại."
                backgroundColor="rgba(239,68,68,0.06)"
                borderColor="rgba(239,68,68,0.15)"
                textColor="#ef4444"
              />
            ) : (
              <Text
                style={{
                  marginTop: 12,
                  color: mutedColor,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Mật khẩu có tối thiểu 6 ký tự.
              </Text>
            )}

            <Button
              variant="solid"
              size="xl"
              action="primary"
              disabled={!canSubmit}
              onPress={onSubmit}
              style={{
                marginTop: 24,
                borderRadius: 16,
                height: 48,
                backgroundColor: canSubmit ? "#0a4c73" : "rgba(10, 76, 115, 0.4)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              <ButtonText style={{ color: "white", fontSize: 15, fontWeight: "800" }}>
                {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </ButtonText>
            </Button>

            {isPending ? (
              <View style={{ marginTop: 16, alignItems: "center" }}>
                <ActivityIndicator color={primaryColor} />
              </View>
            ) : null}

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13, fontWeight: "500" }}>
                Chưa có tài khoản?{" "}
              </Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}>
                  Đăng ký ngay
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MessageBox({
  text,
  backgroundColor,
  borderColor,
  textColor,
}: {
  text: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <View
      style={{
        marginTop: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
        backgroundColor,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ionicons name="alert-circle-outline" size={16} color={textColor} />
      <Text style={{ color: textColor, fontSize: 13, fontWeight: "600", flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}
