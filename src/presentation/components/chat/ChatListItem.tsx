import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Conversation } from '../../../domain/entities/chat';

interface Props {
  conversation: Conversation;
  onPress: (id: string, name?: string) => void;
}

export const ChatListItem = React.memo(({ conversation, onPress }: Props) => {
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black"
      onPress={() => onPress(conversation.id, conversation.otherUserName)}
    >
      <View className="relative">
        <Image 
          source={{ uri: conversation.otherUserAvatarUrl || 'https://via.placeholder.com/150' }}
          className="w-14 h-14 rounded-full"
          contentFit="cover"
        />
        <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-black" />
      </View>
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
            {conversation.otherUserName || 'User'}
          </Text>
          {conversation.lastTime && (
            <Text className="text-xs text-gray-500">
              {new Date(conversation.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between items-center">
          <Text 
            className={`text-sm flex-1 mr-4 ${conversation.unread > 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
            numberOfLines={1}
          >
            {conversation.lastMessage || 'Đã gửi một tin nhắn'}
          </Text>
          {conversation.unread > 0 && (
            <View className="bg-red-500 rounded-full min-w-[20px] h-5 justify-center items-center px-1">
              <Text className="text-white text-xs font-bold">{conversation.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
