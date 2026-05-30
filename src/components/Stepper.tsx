import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = { current: 1 | 2 | 3; labels: [string, string, string] };

export default function Stepper({ current, labels }: Props) {
  return (
    <View className="px-5 pb-2">
      <View className="px-3 flex-row items-center">
        <View className="items-center">
          <View className={`w-8 h-8 rounded-full items-center justify-center ${1 <= current ? "bg-[#CC8F33]" : "bg-[#252525] border border-[#3A3A3A]"}`}>
            {1 < current ? (
              <Ionicons name="checkmark" size={18} color="#000" />
            ) : (
              <Text className={`font-bold ${current === 1 ? "text-black" : "text-[#988C81]"}`}>1</Text>
            )}
          </View>
        </View>

        <View className={`flex-1 h-px ${1 < current ? "bg-[#CC8F33]" : "bg-[#3A3A3A]"}`} />

        <View className="items-center">
          <View className={`w-8 h-8 rounded-full items-center justify-center ${2 <= current ? "bg-[#CC8F33]" : "bg-[#252525] border border-[#3A3A3A]"}`}>
            {2 < current ? (
              <Ionicons name="checkmark" size={18} color="#000" />
            ) : (
              <Text className={`font-bold ${current === 2 ? "text-black" : "text-[#988C81]"}`}>2</Text>
            )}
          </View>
        </View>

        <View className={`flex-1 h-px ${2 < current ? "bg-[#CC8F33]" : "bg-[#3A3A3A]"}`} />

        <View className="items-center">
          <View className={`w-8 h-8 rounded-full items-center justify-center ${3 <= current ? "bg-[#CC8F33]" : "bg-[#252525] border border-[#3A3A3A]"}`}>
            {3 < current ? (
              <Ionicons name="checkmark" size={18} color="#000" />
            ) : (
              <Text className={`font-bold ${current === 3 ? "text-black" : "text-[#988C81]"}`}>3</Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row justify-between mt-2">
        {labels.map((l, i) => (
          <Text
            key={l}
            className={`text-xs ${i + 1 === current ? "text-white" : "text-[#988C81]"}`}
            style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right", flex: 1 }}
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}