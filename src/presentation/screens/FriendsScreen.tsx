import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFriends, useFriendRequests, useFriendActions } from '../hooks/useFriend';
import { UserListItem } from '../components/friend/UserListItem';
import { Feather } from '@expo/vector-icons';

export default function FriendsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'friends' | 'requests'>('friends');

  const { data: friendsData, isLoading: isLoadingFriends } = useFriends(20);
  const { data: requestsData, isLoading: isLoadingRequests } = useFriendRequests(20);
  const { acceptRequest, declineRequest } = useFriendActions();

  const friends = friendsData?.pages.flatMap(p => p.items) || [];
  const requests = requestsData?.pages.flatMap(p => p.items) || [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#0b93f6" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Bạn bè</Text>
      </View>

      <View className="flex-row border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${tab === 'friends' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setTab('friends')}
        >
          <Text className={`font-semibold ${tab === 'friends' ? 'text-blue-500' : 'text-gray-500'}`}>Danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${tab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setTab('requests')}
        >
          <Text className={`font-semibold ${tab === 'requests' ? 'text-blue-500' : 'text-gray-500'}`}>
            Lời mời {requests.length > 0 && `(${requests.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'friends' ? (
        isLoadingFriends ? <ActivityIndicator className="mt-10" /> : (
          <FlatList
            data={friends}
            keyExtractor={item => item.userId}
            renderItem={({ item }) => (
              <UserListItem 
                user={item}
                actionText="Nhắn tin"
                onAction={(id) => router.push(`/chat/${id}` as never)} // In real app, we need conversation ID, not just user ID
                variant="outline"
              />
            )}
            ListEmptyComponent={() => (
              <View className="items-center mt-20">
                <Text className="text-gray-500">Bạn chưa có người bạn nào.</Text>
              </View>
            )}
          />
        )
      ) : (
        isLoadingRequests ? <ActivityIndicator className="mt-10" /> : (
          <FlatList
            data={requests}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <UserListItem 
                user={{
                  userId: item.requesterId,
                  fullName: item.requesterFullName,
                  avatarUrl: item.requesterAvatarUrl,
                }}
                actionText="Chấp nhận"
                onAction={() => acceptRequest.mutate(item.id)}
                variant="primary"
              />
            )}
            ListEmptyComponent={() => (
              <View className="items-center mt-20">
                <Text className="text-gray-500">Không có lời mời kết bạn nào.</Text>
              </View>
            )}
          />
        )
      )}
    </View>
  );
}
