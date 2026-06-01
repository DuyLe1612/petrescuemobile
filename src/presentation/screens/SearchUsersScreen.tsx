import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchUsers, useFriendActions } from '../hooks/useFriend';
import { UserListItem } from '../components/friend/UserListItem';
import { Feather } from '@expo/vector-icons';

export default function SearchUsersScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { data, isLoading } = useSearchUsers(debouncedQuery, 20);
  const { sendRequest } = useFriendActions();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const items = data?.pages.flatMap(p => p.items) || [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Feather name="arrow-left" size={24} color="#0b93f6" />
        </TouchableOpacity>
        <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full flex-row items-center px-3 h-10">
          <Feather name="search" size={18} color="#9ca3af" />
          <TextInput 
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            placeholder="Tìm kiếm người dùng..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
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
          keyExtractor={item => item.userId}
          renderItem={({ item }) => (
            <UserListItem 
              user={item}
              actionText="Kết bạn"
              onAction={(userId) => {
                sendRequest.mutate(userId);
                // Can add optimistic UI or toast here
              }}
              variant="primary"
            />
          )}
        />
      ) : debouncedQuery.length > 0 ? (
        <View className="items-center mt-20">
          <Text className="text-gray-500">Không tìm thấy người dùng nào.</Text>
        </View>
      ) : (
        <View className="items-center mt-20">
          <Feather name="search" size={48} color="#cbd5e1" />
          <Text className="text-gray-500 mt-4">Nhập tên để tìm kiếm bạn bè.</Text>
        </View>
      )}
    </View>
  );
}
