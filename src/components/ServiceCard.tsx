import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  price: string;
  duration: string;
  popular?: boolean;
};

export function ServiceCard({ icon, title, price, duration, popular }: Props) {
  return (
    <View className="flex-1 bg-bg-card bg-[#1C1A17] rounded-2xl p-4 border border-white/5 relative">
      {popular && (
        <View className="absolute top-3 right-3 bg-[#4d36149f] px-2 py-1 rounded-md">
          <Text className="text-[#CC8F33] text-[10px] font-semibold">Popular</Text>
        </View>
      )}
      <View className="w-10 h-10 rounded-xl bg-[#4d36149f] items-center justify-center">
        <Ionicons name={icon} size={25} color="#CC8F33" />
      </View>
      <Text className="text-text text-white font-semibold mt-4 text-base">{title}</Text>
      <View className="flex-row items-center gap-2 mt-1">
        <Text className="text-[#CC8F33] text-lg font-bold pr-2">R$ {price}</Text>
        <View className="flex flex-row items-center gap-1">
          <Ionicons name="time-outline" size={13} color="#988C81" />
          <Text className="text-text-muted text-[#988C81] text-sm">{duration}</Text>
        </View>
      </View>
    </View>
  );
}
