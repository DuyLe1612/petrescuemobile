import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Friend } from '../../../domain/entities/friend';
import { Button, ButtonText } from '@/components/ui/button'; // Assuming gluestack

interface Props {
  user: Friend;
  actionText: string;
  onAction: (userId: string) => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const UserListItem = React.memo(({ user, actionText, onAction, variant = 'primary' }: Props) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary': return "bg-blue-500 rounded-full px-4 h-8";
      case 'secondary': return "bg-gray-200 dark:bg-gray-800 rounded-full px-4 h-8";
      case 'outline': return "border border-blue-500 rounded-full px-4 h-8 bg-transparent";
    }
  };

  const getButtonTextClass = () => {
    switch (variant) {
      case 'primary': return "text-white text-sm font-semibold";
      case 'secondary': return "text-gray-900 dark:text-gray-100 text-sm font-semibold";
      case 'outline': return "text-blue-500 text-sm font-semibold";
    }
  };

  return (
    <View className="flex-row items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
      <Image 
        source={{ uri: user.avatarUrl || 'https://via.placeholder.com/150' }}
        className="w-12 h-12 rounded-full"
        contentFit="cover"
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
          {user.fullName || user.username}
        </Text>
        {user.username && (
          <Text className="text-sm text-gray-500">@{user.username}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        className={`justify-center items-center ${getButtonClass()}`}
        onPress={() => onAction(user.userId)}
      >
        <Text className={getButtonTextClass()}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
});
