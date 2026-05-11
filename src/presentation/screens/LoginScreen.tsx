import { Button, ButtonText } from "@/components/ui/button";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useLogin } from "@/src/presentation/hooks/use-login";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate, isPending, error } = useLogin();

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
          setFormError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
          console.error("Login failed");
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-6 pt-16">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Đăng nhập</Text>
          <Text className="text-base text-muted-foreground">
            Chào mừng bạn quay lại.
          </Text>
        </View>

        <View className="mt-10 gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="rgb(125 125 125)"
              className="h-12 rounded-lg border border-input bg-background px-4 text-foreground"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              Mật khẩu
            </Text>
            <View className="flex-row items-center h-12 rounded-lg border border-input bg-background px-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="rgb(125 125 125)"
                className="flex-1 text-foreground"
              />
              <Pressable
                onPress={() => setShowPassword(v => !v)}
                className="ml-3 px-2 py-1"
                accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <Text className="text-sm text-primary">
                  {showPassword ? "Ẩn" : "Hiện"}
                </Text>
              </Pressable>
            </View>
            <Text className="text-xs text-muted-foreground">
              Tối thiểu 6 ký tự.
            </Text>
          </View>

          {formError ? (
            <View className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <Text className="text-sm text-destructive">{formError}</Text>
            </View>
          ) : error ? (
            <View className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <Text className="text-sm text-destructive">
                Đăng nhập thất bại. Vui lòng thử lại.
              </Text>
            </View>
          ) : null}

          <Button
            variant="solid"
            size="md"
            action="primary"
            disabled={!canSubmit}
            onPress={onSubmit}
            className="mt-2"
          >
            <ButtonText>
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </ButtonText>
          </Button>

          {isPending ? (
            <View className="mt-3 items-center">
              <ActivityIndicator />
            </View>
          ) : null}

          <Text className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản? <Text className="text-primary">Đăng ký</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
