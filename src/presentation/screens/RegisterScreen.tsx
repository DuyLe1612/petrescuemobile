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

const REGISTER_TOKENS = {
  spacing: {
    screenX: 24,
    top: 20,
    section: 24,
  },
  radius: {
    hero: 32,
    card: 28,
    pill: 999,
  },
  elevation: {
    shadowColor: "#171717",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
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

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const mutedColor = useThemeColor({}, "icon");

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
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: REGISTER_TOKENS.spacing.screenX,
            paddingTop: 64,
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              borderRadius: REGISTER_TOKENS.radius.hero,
              backgroundColor: primaryColor,
              paddingHorizontal: REGISTER_TOKENS.spacing.screenX,
              paddingTop: REGISTER_TOKENS.spacing.top,
              paddingBottom: 104,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              style={{
                width: 36,
                height: 36,
                borderRadius: REGISTER_TOKENS.radius.pill,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="rgb(246 252 252)" />
            </Pressable>

            <View style={{ marginTop: REGISTER_TOKENS.spacing.section }}>
              <Text
                style={{
                  color: "rgb(246 252 252)",
                  fontSize: 32,
                  fontWeight: "800",
                }}
              >
                Tạo tài khoản
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  color: "rgba(246,252,252,0.8)",
                  fontSize: 15,
                }}
              >
                Tham gia cộng đồng yêu thú cưng.
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: -66,
              borderRadius: REGISTER_TOKENS.radius.card,
              backgroundColor: cardColor,
              padding: REGISTER_TOKENS.spacing.screenX,
              ...REGISTER_TOKENS.elevation,
            }}
          >
            <View className="gap-4">
              <FormField label="Họ và tên" required>
                <Input
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nguyễn Văn An"
                  left={
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={mutedColor}
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
                  left={
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={mutedColor}
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
                  left={
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={mutedColor}
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
                  left={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={mutedColor}
                    />
                  }
                  right={
                    <Pressable
                      onPress={() => setShowPassword((value) => !value)}
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      hitSlop={8}
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
                  left={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={mutedColor}
                    />
                  }
                  right={
                    <Pressable
                      onPress={() => setShowConfirmPassword((value) => !value)}
                      accessibilityRole="button"
                      accessibilityLabel={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      hitSlop={8}
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
                backgroundColor="rgba(218,65,47,0.08)"
                borderColor="rgba(218,65,47,0.24)"
                textColor="rgb(218 65 47)"
              />
            ) : formNotice ? (
              <MessageBox
                text={formNotice}
                backgroundColor="rgba(39,127,143,0.08)"
                borderColor="rgba(39,127,143,0.2)"
                textColor={primaryColor}
              />
            ) : null}

            <Text
              style={{
                marginTop: 14,
                color: mutedColor,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>Điều khoản sử dụng</Text>
              {" "}và{" "}
              <Text style={{ color: primaryColor, fontWeight: "700" }}>Chính sách bảo mật</Text>
              {" "}của PA.
            </Text>

            <Button
              variant="solid"
              size="xl"
              action="primary"
              disabled={!canSubmit}
              onPress={onSubmit}
              className="mt-5 rounded-2xl h-12"
            >
              <ButtonText className="font-bold">Tạo tài khoản</ButtonText>
            </Button>

            <View style={{ alignItems: "center", marginTop: 14 }}>
              <Text style={{ color: mutedColor, fontSize: 12 }}>hoặc</Text>
            </View>

            <View
              style={{
                marginTop: 14,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13 }}>Đã có tài khoản? </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}>
                  Đăng nhập
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
        borderRadius: 16,
        borderWidth: 1,
        borderColor,
        backgroundColor,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: textColor, fontSize: 13 }}>{text}</Text>
    </View>
  );
}
