import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { current: 1 | 2 | 3; labels: [string, string, string] };

export default function Stepper({ current, labels }: Props) {
  return (
    <View className="px-5 pb-2">
      <View className="flex-row items-center justify-between">
        {[1, 2, 3].map((step, idx) => {
          const done = step < current;
          const active = step === current;
          return (
            <View key={step} className="flex-row items-center flex-1">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  done || active ? "bg-gold" : "bg-bg-elevated border border-line"
                }`}
              >
                {done ? (
                  <Ionicons name="checkmark" size={18} color="#0a0a0a" />
                ) : (
                  <Text className={`font-bold ${active ? "text-bg" : "text-muted"}`}>{step}</Text>
                )}
              </View>
              {idx < 2 && (
                <View className={`flex-1 h-px mx-2 ${step < current ? "bg-gold" : "bg-line"}`} />
              )}
            </View>
          );
        })}
      </View>
      <View className="flex-row justify-between mt-2">
        {labels.map((l, i) => (
          <Text key={l} className={`text-xs ${i + 1 === current ? "text-white" : "text-muted"}`} style={{ width: 90, textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}
