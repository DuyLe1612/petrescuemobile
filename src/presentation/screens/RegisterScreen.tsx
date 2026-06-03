import { Button, ButtonText, Input, FormField } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
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
import { register1 } from "@/src/infrastructure/api/generated/pet-rescue-api";
import type {
  AuthTokenResponseDto,
  RegisterRequestDto,
} from "@/src/infrastructure/api/generated/model";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";

const REGISTER_TOKENS = {
  radius: {
    card: 24,
  },
} as const;

const normalizeRegisterResponse = (response: unknown) => {
  const raw = response as {
    data?: AuthTokenResponseDto | { data?: AuthTokenResponseDto };
  };

  if (raw?.data && "data" in raw.data && raw.data.data) {
    return raw.data.data;
  }

  return raw?.data ?? (response as AuthTokenResponseDto | undefined);
};

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const { mutate, isPending } = useMutation({
    mutationFn: register1,
  });

  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const backgroundColor = useThemeColor(
    { light: "#f6f8fc", dark: "#121212" },
    "background",
  );
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1f1f1e" },
    "background",
  );
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor(
    { light: "#e2e8f0", dark: "#2d2d2c" },
    "icon",
  );

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      !isPending
    );
  }, [confirmPassword, email, fullName, isPending, password, phone]);

  const onSubmit = () => {
    setFormError(null);
    setFormNotice(null);

    if (fullName.trim().length < 2) {
      setFormError("Vui long nhap ho va ten hop le.");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Vui long nhap email hop le.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 9) {
      setFormError("Vui long nhap so dien thoai hop le.");
      return;
    }

    if (password.length < 8) {
      setFormError("Mat khau phai co it nhat 8 ky tu.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Xac nhan mat khau chua khop.");
      return;
    }

    const usernameFromEmail = email.trim().split("@")[0]?.trim() ?? "";
    const sanitizedPhone = phone.replace(/\D/g, "");
    const fallbackUsername = sanitizedPhone ? `user${sanitizedPhone}` : "";
    const username = (usernameFromEmail || fallbackUsername || fullName.trim())
      .replace(/\s+/g, "")
      .slice(0, 50);

    if (username.length < 3) {
      setFormError("Khong the tao ten nguoi dung hop le tu thong tin dang ky.");
      return;
    }

    const payload: RegisterRequestDto = {
      username,
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
    };

    mutate(payload, {
      async onSuccess(response) {
        const result = normalizeRegisterResponse(response);

        if (result?.accessToken && result?.refreshToken) {
          await tokenStorage.set(result.accessToken, result.refreshToken);
          router.replace("/(tabs)");
          return;
        }

        setFormNotice(
          "Dang ky thanh cong. Vui long kiem tra email hoac dang nhap de tiep tuc.",
        );
        setTimeout(() => {
          router.replace("/login");
        }, 1200);
      },
      onError(error: any) {
        setFormError(
          error?.message ||
            "Dang ky that bai. Vui long kiem tra lai thong tin.",
        );
      },
    });
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
        <View
          style={{ flex: 1, paddingBottom: Math.max(insets.bottom + 24, 32) }}
        >
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
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                }}
              >
                Tao tai khoan
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Tham gia cong dong yeu thuong va cuu ho thu cung.
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: -52,
              marginHorizontal: 20,
              borderRadius: REGISTER_TOKENS.radius.card,
              backgroundColor: cardColor,
              padding: 24,
              borderWidth: 1,
              borderColor,
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            <View style={{ gap: 16 }}>
              <FormField label="Ho va ten" required>
                <Input
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nguyen Van An"
                  style={inputStyle(borderColor)}
                  left={
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={mutedColor}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              </FormField>

              <FormField label="Email" required>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@gmail.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={inputStyle(borderColor)}
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

              <FormField label="So dien thoai" required>
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0921 345 678"
                  keyboardType="phone-pad"
                  style={inputStyle(borderColor)}
                  left={
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={mutedColor}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              </FormField>

              <FormField label="Mat khau" required>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="It nhat 8 ky tu"
                  secureTextEntry={!showPassword}
                  style={inputStyle(borderColor)}
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
                      accessibilityLabel={
                        showPassword ? "An mat khau" : "Hien mat khau"
                      }
                      hitSlop={12}
                      style={{ paddingHorizontal: 4 }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={mutedColor}
                      />
                    </Pressable>
                  }
                />
              </FormField>

              <FormField label="Xac nhan mat khau" required>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhap lai mat khau"
                  secureTextEntry={!showConfirmPassword}
                  style={inputStyle(borderColor)}
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
                      onPress={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        showConfirmPassword ? "An mat khau" : "Hien mat khau"
                      }
                      hitSlop={12}
                      style={{ paddingHorizontal: 4 }}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={18}
                        color={mutedColor}
                      />
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
                type="error"
              />
            ) : formNotice ? (
              <MessageBox
                text={formNotice}
                backgroundColor="rgba(10, 76, 115, 0.05)"
                borderColor="rgba(10, 76, 115, 0.12)"
                textColor="#0a4c73"
                type="notice"
              />
            ) : null}

            <Text
              style={{
                marginTop: 16,
                color: mutedColor,
                fontSize: 12,
                lineHeight: 18,
                fontWeight: "500",
              }}
            >
              Bang cach dang ky, ban dong y voi{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>
                Dieu khoan su dung
              </Text>{" "}
              va{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>
                Chinh sach bao mat
              </Text>{" "}
              cua chung toi.
            </Text>

            <Button
              variant="solid"
              size="xl"
              action="primary"
              disabled={!canSubmit}
              onPress={onSubmit}
              style={{
                marginTop: 20,
                borderRadius: 16,
                height: 48,
                backgroundColor: canSubmit
                  ? "#0a4c73"
                  : "rgba(10, 76, 115, 0.4)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <ButtonText
                  style={{ color: "white", fontSize: 15, fontWeight: "800" }}
                >
                  Tao tai khoan
                </ButtonText>
              )}
            </Button>

            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={{ color: mutedColor, fontSize: 12, fontWeight: "500" }}>
                hoac
              </Text>
            </View>

            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: mutedColor, fontSize: 13, fontWeight: "500" }}
              >
                Da co tai khoan?{" "}
              </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text
                  style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}
                >
                  Dang nhap ngay
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function inputStyle(borderColor: string) {
  return {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor,
    paddingHorizontal: 12,
    backgroundColor: Platform.OS === "web" ? "transparent" : undefined,
  } as const;
}

function MessageBox({
  text,
  backgroundColor,
  borderColor,
  textColor,
  type,
}: {
  text: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  type: "error" | "notice";
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
      <Ionicons
        name={
          type === "error"
            ? "alert-circle-outline"
            : "information-circle-outline"
        }
        size={16}
        color={textColor}
      />
      <Text
        style={{ color: textColor, fontSize: 13, fontWeight: "600", flex: 1 }}
      >
        {text}
      </Text>
    </View>
  );
}
