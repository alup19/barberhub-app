import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
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
      ? "bg-gold"
      : variant === "outline"
      ? "border border-line bg-bg-elevated"
      : "bg-danger/10 border border-danger/40";
  const text = variant === "primary" ? "text-bg" : variant === "danger" ? "text-danger" : "text-white";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={`${base} ${styles} ${disabled ? "opacity-50" : ""}`}
    >
      <Text className={`font-bold text-base ${text}`}>{label}</Text>
      {icon && <Ionicons name={icon} size={18} color={variant === "primary" ? "#0a0a0a" : "#fff"} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
}
