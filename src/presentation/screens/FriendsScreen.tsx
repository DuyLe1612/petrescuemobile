import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFriends, useFriendRequests, useFriendActions } from '../hooks/useFriend';
import { UserListItem } from '../components/friend/UserListItem';
import { Feather } from '@expo/vector-icons';
import { HeaderBar } from '@/components/ui/header-bar';

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
      <HeaderBar
        title="Bạn bè"
        onBack={() => router.back()}
      />

      <View className="flex-row border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity 
          className="flex-1 py-3 items-center"
          style={{ borderBottomWidth: tab === 'friends' ? 2 : 0, borderBottomColor: '#0a4c73' }}
          onPress={() => setTab('friends')}
        >
          <Text style={{ fontWeight: '600', color: tab === 'friends' ? '#0a4c73' : '#6b7280' }}>Danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 py-3 items-center"
          style={{ borderBottomWidth: tab === 'requests' ? 2 : 0, borderBottomColor: '#0a4c73' }}
          onPress={() => setTab('requests')}
        >
          <Text style={{ fontWeight: '600', color: tab === 'requests' ? '#0a4c73' : '#6b7280' }}>
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
