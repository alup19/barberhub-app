import { View, Text } from "react-native";

type Variant = "Pendente" | "Próximo" | "Cancelado" | "Barbeiro" | "Folga" | "PREMIUM";

const styles: Record<Variant, { bg: string; text: string; border: string }> = {
  Pendente: { bg: "bg-[#C5C1B915]", text: "text-[#C5C1B9]", border: "border-border" },
  Próximo: { bg: "bg-[#CC8F3315]", text: "text-[#CC8F33]", border: "border-gold/40" },
  Cancelado: { bg: "bg-[#DC282815]", text: "text-[#DC2828]", border: "border-danger/40" },
  Barbeiro: { bg: "bg-[#292623]", text: "text-[#C5C1B9]", border: "border-border" },
  Folga: { bg: "bg-[#292623]", text: "text-[#C5C1B9]", border: "border-border" },
  PREMIUM: { bg: "bg-[#CC8F3315]", text: "text-[#CC8F33]", border: "border-gold/40" },
};

export default function StatusBadge({ label }: { label: Variant }) {
  const s = styles[label];
  return (
    <View className={`px-3 py-2 rounded-md border-0 ${s.bg} ${s.border}`}>
      <Text className={`text-[11px] font-semibold ${s.text}`}>{label}</Text>
    </View>
  );
}
