import { View, Text } from "react-native";

type Variant = "Pendente" | "Próximo" | "Cancelado" | "Barbeiro" | "Folga" | "PREMIUM";

const styles: Record<Variant, { bg: string; text: string; border: string }> = {
  Pendente: { bg: "bg-surface2", text: "text-textmuted", border: "border-border" },
  Próximo: { bg: "bg-goldDark/30", text: "text-gold", border: "border-gold/40" },
  Cancelado: { bg: "bg-danger/15", text: "text-danger", border: "border-danger/40" },
  Barbeiro: { bg: "bg-surface2", text: "text-textmuted", border: "border-border" },
  Folga: { bg: "bg-surface2", text: "text-textmuted", border: "border-border" },
  PREMIUM: { bg: "bg-goldDark/30", text: "text-gold", border: "border-gold/40" },
};

export default function StatusBadge({ label }: { label: Variant }) {
  const s = styles[label];
  return (
    <View className={`px-2.5 py-1 rounded-md border ${s.bg} ${s.border}`}>
      <Text className={`text-[11px] font-semibold ${s.text}`}>{label}</Text>
    </View>
  );
}
