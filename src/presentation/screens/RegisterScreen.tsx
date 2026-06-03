import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonText, Input, FormField } from "@/components/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const REGISTER_TOKENS = {
  radius: {
    card: 24,
    pill: 999,
  },
} as const;

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

  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6
    );
  }, [confirmPassword, email, fullName, password, phone]);

  const onSubmit = () => {
    setFormError(null);
    setFormNotice(null);

    if (fullName.trim().length < 2) {
      setFormError("Vui lòng nhập họ và tên hợp lệ.");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Vui lòng nhập email hợp lệ.");
      return;
    }

    if (phone.trim().length < 9) {
      setFormError("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }

    if (password.length < 6) {
      setFormError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Xác nhận mật khẩu chưa khớp.");
      return;
    }

    setFormNotice("UI đăng ký đã sẵn sàng. Bước tiếp theo là nối API tạo tài khoản.");
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
                borderRadius: REGISTER_TOKENS.radius.pill,
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
                Tạo tài khoản
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Tham gia cộng đồng yêu thương và cứu hộ thú cưng.
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View
            style={{
              marginTop: -52,
              marginHorizontal: 20,
              borderRadius: REGISTER_TOKENS.radius.card,
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
            <View style={{ gap: 16 }}>
              <FormField label="Họ và tên" required>
                <Input
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nguyễn Văn An"
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

              <FormField label="Số điện thoại" required>
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0921 345 678"
                  keyboardType="phone-pad"
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
                      name="call-outline"
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
                  placeholder="Ít nhất 6 ký tự"
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
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={mutedColor}
                      />
                    </Pressable>
                  }
                />
              </FormField>

              <FormField label="Xác nhận mật khẩu" required>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={!showConfirmPassword}
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
                      onPress={() => setShowConfirmPassword((value) => !value)}
                      accessibilityRole="button"
                      accessibilityLabel={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      hitSlop={12}
                      style={{ paddingHorizontal: 4 }}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
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
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>Điều khoản sử dụng</Text>
              {" "}và{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>Chính sách bảo mật</Text>
              {" "}của chúng tôi.
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
                backgroundColor: canSubmit ? "#0a4c73" : "rgba(10, 76, 115, 0.4)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              <ButtonText style={{ color: "white", fontSize: 15, fontWeight: "800" }}>Tạo tài khoản</ButtonText>
            </Button>

            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={{ color: mutedColor, fontSize: 12, fontWeight: "500" }}>hoặc</Text>
            </View>

            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13, fontWeight: "500" }}>Đã có tài khoản? </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}>
                  Đăng nhập ngay
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
        name={type === "error" ? "alert-circle-outline" : "information-circle-outline"}
        size={16}
        color={textColor}
      />
      <Text style={{ color: textColor, fontSize: 13, fontWeight: "600", flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}
