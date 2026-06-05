import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export default function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-8 pb-4">
      <View className="flex-row items-center flex-1">
        {onBack ? (
          <TouchableOpacity onPress={onBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : null}

        <View className="flex-1">
          <Text className="text-2xl text-white" style={{ fontFamily: "Arial" }}>
            {title}
          </Text>
          {subtitle ? <Text className="text-[#988C81] text-sm mt-1">{subtitle}</Text> : null}
        </View>
      </View>

      {right ? <View>{right}</View> : null}
    </View>
  );
}
