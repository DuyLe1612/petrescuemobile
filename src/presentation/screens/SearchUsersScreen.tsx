import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFriendActions, useSearchUsers } from "../hooks/useFriend";
import { HeaderBar } from "@/components/ui/header-bar";

export default function SearchUsersScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data, isLoading } = useSearchUsers(debouncedQuery, 20);
  const { sendRequest } = useFriendActions();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const items = data?.pages.flatMap((p) => p.items) || [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <HeaderBar
        title="Tìm bạn"
        subtitle="Kết nối và nhắn tin ngay"
        onBack={() => router.back()}
      />

      <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <View className="bg-gray-100 dark:bg-gray-900 rounded-2xl flex-row items-center px-4 h-12">
          <Feather name="search" size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            placeholder="Nhập tên hoặc username..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} className="pl-2">
              <Feather name="x-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading && debouncedQuery.length > 0 ? (
        <ActivityIndicator className="mt-10" />
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View className="mx-4 mt-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-neutral-900">
              <View className="flex-row items-center px-4 pt-4">
                <Image
                  source={{
                    uri: item.avatarUrl || "https://via.placeholder.com/150",
                  }}
                  className="w-12 h-12 rounded-full"
                  contentFit="cover"
                />
                <View className="flex-1 ml-3">
                  <Text
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                    numberOfLines={1}
                  >
                    {item.fullName || item.username}
                  </Text>
                  {item.username && (
                    <Text className="text-sm text-gray-500">
                      @{item.username}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row gap-3 px-4 pb-4 pt-3">
                <TouchableOpacity
                  className="flex-1 rounded-full py-2 items-center"
                  style={{ backgroundColor: '#0a4c73' }}
                  onPress={() => sendRequest.mutate(item.userId)}
                >
                  <Text className="text-white text-sm font-semibold">
                    Kết bạn
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 border rounded-full py-2 items-center"
                  style={{ borderColor: '#0a4c73' }}
                  onPress={() => router.push(`/chat/${item.userId}` as never)}
                >
                  <Text className="text-sm font-semibold" style={{ color: '#0a4c73' }}>
                    Nhắn tin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={() => <View className="h-6" />}
        />
      ) : debouncedQuery.length > 0 ? (
        <View className="items-center mt-20">
          <Text className="text-gray-500">Không tìm thấy người dùng nào.</Text>
        </View>
      ) : (
        <View className="items-center mt-20 px-6">
          <Feather name="search" size={48} color="#cbd5e1" />
          <Text className="text-gray-500 mt-4 text-center">
            Nhập tên hoặc username để tìm kiếm bạn bè.
          </Text>
        </View>
      )}
    </View>
  );
}
