import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

type Props = {
  label?: string;
  title?: string;
  onPress?: () => void;
  className?: string;
};

export function GoldButton({ label, title, onPress, className }: Props) {
  const buttonText = label || title || "";
  return (
    <Pressable onPress={onPress} className={className}>
      <View
        style={{
          shadowColor: "#e2b558",
          shadowOpacity: 0.45,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
          borderRadius: 16,
        }}
      >
        <LinearGradient
          colors={["#CC8F33", "#c79a3e", "#e2b558"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="text-[#0a0805] text-lg font-bold tracking-wide">
            {buttonText}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
