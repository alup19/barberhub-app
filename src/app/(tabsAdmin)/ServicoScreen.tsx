import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBadge from "../../components/StatusBadge";
import { categories, adminServices as services } from "../../constants/data";

export default function ServicosScreen({ onNew }: { onNew: () => void }) {
  const [cat, setCat] = useState("Todos");
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader
        title="Serviços"
        subtitle="6 serviços ativos"
        right={
          <TouchableOpacity onPress={onNew} className="bg-gold flex-row items-center px-4 py-2.5 rounded-xl">
            <Ionicons name="add" size={18} color="#000" />
            <Text className="text-black font-bold ml-1">Novo</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
        <View className="flex-row gap-2">
          {categories.map((c) => {
            const active = c === cat;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCat(c)}
                className={`px-4 py-2.5 rounded-full border ${active ? "bg-gold border-gold" : "bg-surface border-border"}`}
              >
                <Text className={active ? "text-black font-bold" : "text-textmuted"}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="gap-3">
        {services.map((s) => {
          const inactive = !s.active;
          return (
            <View
              key={s.id}
              className={`bg-surface border rounded-2xl p-4 flex-row items-center ${
                s.tag === "PREMIUM" ? "border-gold/50" : "border-border"
              } ${inactive ? "opacity-60" : ""}`}
            >
              <View className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${s.tag === "PREMIUM" ? "bg-goldDark/30" : "bg-surface2"}`}>
                <Ionicons name={s.icon} size={20} color={s.tag === "PREMIUM" ? "#D4A24C" : "#9A9AA5"} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2 flex-wrap">
                  <Text className={`font-bold ${inactive ? "text-textmuted" : "text-white"}`}>{s.name}</Text>
                  {s.tag && <StatusBadge label={s.tag} />}
                </View>
                <Text className="text-textmuted text-xs mt-0.5">{s.time}</Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-lg ${inactive ? "text-textmuted" : "text-gold"}`}>{s.price}</Text>
                {inactive ? (
                  <Text className="text-textmuted text-[11px]">Inativo</Text>
                ) : (
                  <View className="flex-row gap-1.5 mt-1">
                    <IconBtn name="arrow-up-outline" />
                    <IconBtn name="create-outline" />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const IconBtn = ({ name }: { name: keyof typeof Ionicons.glyphMap }) => (
  <TouchableOpacity className="w-7 h-7 rounded-md bg-surface2 border border-border items-center justify-center">
    <Ionicons name={name} size={13} color="#D4A24C" />
  </TouchableOpacity>
);
