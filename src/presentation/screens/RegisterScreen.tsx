import { Feather } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { router } from "expo-router";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const REGISTER_TOKENS = {
  spacing: {
    screenX: 24,
    top: 20,
    section: 24,
    field: 14,
    inputX: 16,
  },
  size: {
    backButton: 36,
    icon: 18,
    input: 52,
    button: 54,
  },
  radius: {
    hero: 32,
    card: 28,
    input: 16,
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
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const mutedColor = useThemeColor({}, "icon");
  const mutedSurfaceColor = useThemeColor(
    { light: "rgb(243 242 240)", dark: "rgb(42 39 36)" },
    "background",
  );

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
                width: REGISTER_TOKENS.size.backButton,
                height: REGISTER_TOKENS.size.backButton,
                borderRadius: REGISTER_TOKENS.radius.pill,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Feather name="chevron-left" size={20} color="rgb(246 252 252)" />
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
            <View style={{ gap: REGISTER_TOKENS.spacing.field }}>
              <Field
                label="Họ và tên"
                required
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn An"
                icon="user"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
              />

              <Field
                label="Email"
                required
                value={email}
                onChangeText={setEmail}
                placeholder="email@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                icon="mail"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
              />

              <Field
                label="Số điện thoại"
                required
                value={phone}
                onChangeText={setPhone}
                placeholder="0921 345 678"
                keyboardType="phone-pad"
                icon="phone"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
              />

              <Field
                label="Mật khẩu"
                required
                value={password}
                onChangeText={setPassword}
                placeholder="Ít nhất 6 ký tự"
                secureTextEntry={!showPassword}
                icon="lock"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
                rightAction={
                  <PasswordToggle
                    visible={showPassword}
                    onPress={() => setShowPassword((value) => !value)}
                    color={mutedColor}
                  />
                }
              />

              <Field
                label="Xác nhận mật khẩu"
                required
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showConfirmPassword}
                icon="lock"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
                rightAction={
                  <PasswordToggle
                    visible={showConfirmPassword}
                    onPress={() => setShowConfirmPassword((value) => !value)}
                    color={mutedColor}
                  />
                }
              />
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
              className="mt-5 rounded-2xl"
              style={{ height: REGISTER_TOKENS.size.button }}
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

type FieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  required?: boolean;
  icon: keyof typeof Feather.glyphMap;
  textColor: string;
  mutedColor: string;
  surfaceColor: string;
  borderColor: string;
  rightAction?: ReactNode;
};

function Field({
  label,
  required = false,
  icon,
  textColor,
  mutedColor,
  surfaceColor,
  borderColor,
  rightAction,
  ...inputProps
}: FieldProps) {
  return (
    <View>
      <Text
        style={{
          marginBottom: 8,
          color: textColor,
          fontSize: 13,
          fontWeight: "700",
        }}
      >
        {label}
        {required ? <Text style={{ color: "rgb(218 65 47)" }}> *</Text> : null}
      </Text>

      <View
        style={{
          height: REGISTER_TOKENS.size.input,
          borderRadius: REGISTER_TOKENS.radius.input,
          borderWidth: 1,
          borderColor,
          backgroundColor: surfaceColor,
          paddingHorizontal: REGISTER_TOKENS.spacing.inputX,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Feather name={icon} size={REGISTER_TOKENS.size.icon} color={mutedColor} />
        <TextInput
          {...inputProps}
          placeholderTextColor={mutedColor}
          style={{
            flex: 1,
            color: textColor,
            fontSize: 15,
            paddingVertical: 0,
          }}
        />
        {rightAction}
      </View>
    </View>
  );
}

function PasswordToggle({
  visible,
  onPress,
  color,
}: {
  visible: boolean;
  onPress: () => void;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      hitSlop={8}
    >
      <Feather name={visible ? "eye" : "eye-off"} size={16} color={color} />
    </Pressable>
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
