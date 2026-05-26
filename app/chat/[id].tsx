import ChatConversationScreen from "@/src/presentation/screens/ChatConversationScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  return <ChatConversationScreen route={{ params: { id: params.id } }} />;
}
