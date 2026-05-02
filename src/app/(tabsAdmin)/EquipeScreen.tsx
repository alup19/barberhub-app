import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBadge from "../../components/StatusBadge";
import { team } from "../../constants/data";

export default function EquipeScreen({ onNew }: { onNew: () => void }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader
        title="Equipe"
        subtitle="3 barbeiros ativos"
        right={
          <TouchableOpacity onPress={onNew} className="bg-gold flex-row items-center px-4 py-2.5 rounded-xl">
            <Ionicons name="add" size={18} color="#000" />
            <Text className="text-black font-bold ml-1">Novo</Text>
          </TouchableOpacity>
        }
      />

      <View className="gap-4">
        {team.map((m) => (
          <View key={m.id} className="bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-surface2 items-center justify-center mr-3 border border-border relative">
                <Text className="text-white font-bold">{m.initial}</Text>
                <View className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${m.online ? "bg-success" : "bg-textmuted"}`} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-base">{m.name}</Text>
                  <StatusBadge label={m.status} />
                </View>
                <Text className="text-textmuted text-xs mt-0.5">Barbeiro · {m.years}</Text>
              </View>
              <TouchableOpacity className="w-9 h-9 items-center justify-center">
                <Ionicons name="ellipsis-vertical" size={18} color="#9A9AA5" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 mb-3">
              <Stat value={String(m.cuts)} valueColor="text-gold" sub="cortes/mês" />
              <Stat value={`${m.rating}★`} sub="avaliação" />
              <Stat value={String(m.today)} sub="hoje" />
            </View>

            <TouchableOpacity className="bg-surface2 border border-border rounded-xl p-3 flex-row items-center">
              <View className="flex-1">
                <Text className="text-textmuted text-xs mb-0.5">{m.status === "Folga" ? "Próximo dia de trabalho" : "Horário de Trabalho"}</Text>
                <Text className="text-white text-sm">{m.schedule}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4A24C" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const Stat = ({ value, sub, valueColor = "text-white" }: { value: string; sub: string; valueColor?: string }) => (
  <View className="flex-1 bg-surface2 border border-border rounded-xl py-3 items-center">
    <Text className={`font-bold text-lg ${valueColor}`}>{value}</Text>
    <Text className="text-textmuted text-[11px] mt-0.5">{sub}</Text>
  </View>
);
