import { Button, ButtonText } from "@/components/ui/button";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useLogin } from "@/src/presentation/hooks/use-login";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useLogin();

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 6 && !isPending;
  }, [email, password, isPending]);

  const onSubmit = () => {
    mutate(
      { emailOrUsername: email.trim(), password },
      {
        onSuccess(data) {
          console.log("Login successful! Access Token:", data);

          alert("Login successful! Access Token: " + data.accessToken);
          debugger;
          tokenStorage.set(data.accessToken, data.refreshToken);
          <Toast action="success">
            <ToastTitle>Welcome</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>;
          debugger;
          router.replace("/(tabs)");
        },
        onError(error: any) {
          <Toast action="error">
            <ToastTitle>Welcome</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>;
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
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="rgb(125 125 125)"
              className="h-12 rounded-lg border border-input bg-background px-4 text-foreground"
            />
            <Text className="text-xs text-muted-foreground">
              Tối thiểu 6 ký tự.
            </Text>
          </View>

          {error ? (
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
