import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View className="flex-row items-center px-5 pt-2 pb-4">
      <TouchableOpacity onPress={onBack ?? (() => router.back())} className="mr-3">
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text className="text-2xl text-white" style={{ fontFamily: "serif" }}>
        {title}
      </Text>
    </View>
  );
}
