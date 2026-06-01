import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../../../domain/entities/chat';

interface Props {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = React.memo(({ message, isOwn }: Props) => {
  return (
    <View className={`w-full flex-row my-1 px-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <View 
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isOwn 
            ? 'bg-blue-500 rounded-br-sm' 
            : 'bg-gray-200 dark:bg-gray-800 rounded-bl-sm'
        }`}
      >
        <Text className={`text-base ${isOwn ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {message.content}
        </Text>
        <Text className={`text-[10px] mt-1 text-right ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
});
