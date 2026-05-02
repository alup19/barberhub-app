import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TabKey = "agenda" | "equipe" | "servicos" | "config";

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "agenda", label: "Agenda", icon: "calendar-outline" },
  { key: "equipe", label: "Equipe", icon: "person-outline" },
  { key: "servicos", label: "Serviços", icon: "menu-outline" },
  { key: "config", label: "Config", icon: "sunny-outline" },
];

type Props = { active: TabKey; onChange: (k: TabKey) => void };

export default function BottomTabs({ active, onChange }: Props) {
  return (
    <View className="flex-row bg-bg border-t border-surface2 pt-2 pb-6">
      {TABS.map((t) => {
        const isActive = active === t.key;
        const color = isActive ? "#D4A24C" : "#6B6B75";
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onChange(t.key)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <Ionicons name={t.icon} size={22} color={color} />
            <Text style={{ color }} className="text-xs mt-1">
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
