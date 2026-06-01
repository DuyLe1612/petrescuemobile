import { Feather } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useLogin } from "@/src/presentation/hooks/use-login";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { router } from "expo-router";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const LOGIN_TOKENS = {
  spacing: {
    screenX: 24,
    top: 20,
    section: 24,
    field: 18,
    inputX: 16,
  },
  size: {
    backButton: 36,
    icon: 18,
    input: 52,
    button: 52,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate, isPending, error } = useLogin();

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
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: LOGIN_TOKENS.spacing.screenX,
            paddingTop: 64,
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              borderRadius: LOGIN_TOKENS.radius.hero,
              backgroundColor: primaryColor,
              paddingHorizontal: LOGIN_TOKENS.spacing.screenX,
              paddingTop: LOGIN_TOKENS.spacing.top,
              paddingBottom: 96,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              style={{
                width: LOGIN_TOKENS.size.backButton,
                height: LOGIN_TOKENS.size.backButton,
                borderRadius: LOGIN_TOKENS.radius.pill,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Feather name="chevron-left" size={20} color="rgb(246 252 252)" />
            </Pressable>

            <View style={{ marginTop: LOGIN_TOKENS.spacing.section }}>
              <Text
                style={{
                  color: "rgb(246 252 252)",
                  fontSize: 32,
                  fontWeight: "800",
                }}
              >
                Đăng nhập
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  color: "rgba(246,252,252,0.8)",
                  fontSize: 15,
                }}
              >
                Chào mừng bạn quay lại.
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: -56,
              borderRadius: LOGIN_TOKENS.radius.card,
              backgroundColor: cardColor,
              padding: LOGIN_TOKENS.spacing.screenX,
              ...LOGIN_TOKENS.elevation,
            }}
          >
            <View style={{ gap: LOGIN_TOKENS.spacing.field }}>
              <Field
                label="Email"
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
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                icon="lock"
                textColor={textColor}
                mutedColor={mutedColor}
                surfaceColor={mutedSurfaceColor}
                borderColor={borderColor}
                rightAction={
                  <Pressable
                    onPress={() => setShowPassword((value) => !value)}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    hitSlop={8}
                  >
                    <Text
                      style={{
                        color: primaryColor,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </Text>
                  </Pressable>
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
            ) : error ? (
              <MessageBox
                text="Đăng nhập thất bại. Vui lòng thử lại."
                backgroundColor="rgba(218,65,47,0.08)"
                borderColor="rgba(218,65,47,0.24)"
                textColor="rgb(218 65 47)"
              />
            ) : (
              <Text
                style={{
                  marginTop: 14,
                  color: mutedColor,
                  fontSize: 12,
                }}
              >
                Tối thiểu 6 ký tự cho mật khẩu.
              </Text>
            )}

            <Button
              variant="solid"
              size="xl"
              action="primary"
              disabled={!canSubmit}
              onPress={onSubmit}
              className="mt-6 rounded-2xl"
              style={{ height: LOGIN_TOKENS.size.button }}
            >
              <ButtonText className="font-bold">
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
                marginTop: 18,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13 }}>Chưa có tài khoản? </Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text style={{ color: primaryColor, fontSize: 13, fontWeight: "700" }}>
                  Đăng ký
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
  icon: keyof typeof Feather.glyphMap;
  textColor: string;
  mutedColor: string;
  surfaceColor: string;
  borderColor: string;
  rightAction?: ReactNode;
};

function Field({
  label,
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
      </Text>

      <View
        style={{
          height: LOGIN_TOKENS.size.input,
          borderRadius: LOGIN_TOKENS.radius.input,
          borderWidth: 1,
          borderColor,
          backgroundColor: surfaceColor,
          paddingHorizontal: LOGIN_TOKENS.spacing.inputX,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Feather name={icon} size={LOGIN_TOKENS.size.icon} color={mutedColor} />
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
