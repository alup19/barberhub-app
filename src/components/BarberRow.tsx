import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = { initial: string; name: string; role: string; rating: string };

export function BarberRow({ initial, name, role, rating }: Props) {
  return (
    <View className="flex-row items-center bg-bg-card bg-[#1C1A17] rounded-2xl p-4 border border-white/5">
      <LinearGradient
        colors={["#CC8F33", "#c79a3e", "#e2b558"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text className="text-[#0a0805] font-bold text-lg">{initial}</Text>
      </LinearGradient>

      <View className="flex-1 ml-4">
        <Text className="text-text text-white font-semibold text-base">{name}</Text>
        <Text className="text-text-muted text-[#988C81] text-xs mt-0.5">{role}</Text>
      </View>
      <View className="flex-row items-center gap-1 bg-[#4d36149f] px-2.5 py-1 rounded-lg">
        <Ionicons name="star" size={12} color="#e2b558" />
        <Text className="text-[#CC8F33] text-xs font-semibold">{rating}</Text>
      </View>
    </View>
  );
}
