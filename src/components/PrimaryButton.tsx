import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "outline" | "danger";
};

export default function PrimaryButton({ label, onPress, disabled, icon, variant = "primary" }: Props) {
  const base = "rounded-2xl py-4 px-6 flex-row items-center justify-center";
  const styles =
    variant === "primary"
      ? "bg-[#CC8F33]"
      : variant === "outline"
      ? "border border-[#3A3A3A] bg-[#252525]"
      : "bg-[#E5484D10] border border-[#E5484D40]";
  const textColor =
    variant === "primary" ? "text-black" :
    variant === "danger" ? "text-[#E5484D]" :
    "text-white";
  const iconColor =
    variant === "primary" ? "#000" :
    variant === "danger" ? "#E5484D" :
    "#fff";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={`${base} ${styles} ${disabled ? "opacity-50" : ""}`}
    >
      <Text className={`font-bold text-base ${textColor}`}>{label}</Text>
      {icon && <Ionicons name={icon} size={18} color={iconColor} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
}