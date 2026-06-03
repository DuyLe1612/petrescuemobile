import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Conversation } from "../../../domain/entities/chat";
import { formatChatListTime } from "../../utils/chat-time";

interface Props {
  conversation: Conversation;
  onPress: (id: string, name?: string) => void;
}

export const ChatListItem = React.memo(({ conversation, onPress }: Props) => {
  const formattedTime = formatChatListTime(conversation.lastTime);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="mx-4 mb-3 flex-row items-center rounded-[24px] border border-[#dbe6f0] bg-white px-4 py-4"
      style={{
        shadowColor: "#164a6b",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
      onPress={() => onPress(conversation.id, conversation.otherUserName)}
    >
      <View className="relative">
        <Image
          source={{
            uri:
              conversation.otherUserAvatarUrl || "https://via.placeholder.com/150",
          }}
          className="h-14 w-14 rounded-full bg-[#e9f1f7]"
          contentFit="cover"
        />
        <View className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#34c759]" />
      </View>

      <View className="ml-4 flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text
            className="flex-1 pr-3 text-base font-extrabold text-[#14324a]"
            numberOfLines={1}
          >
            {conversation.otherUserName || "User"}
          </Text>
          {formattedTime ? (
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-[#7a8a98]">
              {formattedTime}
            </Text>
          ) : null}
        </View>

        {conversation.relatedInfo ? (
          <View className="mb-2 self-start rounded-full bg-[#edf5fb] px-2.5 py-1">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#0a4c73]">
              {conversation.relatedInfo}
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between">
          <Text
            className={`mr-4 flex-1 text-sm leading-5 ${
              conversation.unread > 0
                ? "font-semibold text-[#1b3548]"
                : "text-[#70808d]"
            }`}
            numberOfLines={1}
          >
            {conversation.lastMessage || "Da gui mot tin nhan"}
          </Text>
          {conversation.unread > 0 ? (
            <View className="min-w-[22px] items-center justify-center rounded-full bg-[#ff6b57] px-1.5 py-1">
              <Text className="text-[11px] font-extrabold text-white">
                {conversation.unread}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});
