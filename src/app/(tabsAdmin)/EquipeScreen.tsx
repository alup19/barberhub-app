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
          <TouchableOpacity onPress={onNew} className="bg-[#CC8F33] flex-row items-center px-4 py-2.5 rounded-xl">
            <Ionicons name="add" size={18} color="#000" />
            <Text className="text-black font-bold ml-1">Novo</Text>
          </TouchableOpacity>
        }
      />

      <View className="gap-4">
        {team.map((m) => (
          <View
            key={m.id}
            className={`border rounded-2xl p-4 ${m.status === "Folga"
                ? "bg-[#161616] border-[#2A2A2A] opacity-65"
                : "bg-[#1B1B1B] border-[#3A3A3A]"
              }`}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-[#292623] items-center justify-center mr-3 relative">
                <Text className="text-[#C5C1B9] font-bold">{m.initial}</Text>
                <View className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#292623] ${m.status === "Folga" ? "bg-[#3A3A3A]" : "bg-[#22C55E]"}`} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-base">{m.name}</Text>
                  <StatusBadge label={m.status} />
                </View>
                <Text className="text-[#988C81] text-xs mt-0.5">Barbeiro · {m.years}</Text>
              </View>
              <TouchableOpacity className="w-9 h-9 items-center justify-center bg-[#292623] rounded-lg">
                <Ionicons name="ellipsis-vertical" size={18} color="#9A9AA5" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 mb-3">
              <Stat value={String(m.cuts)} valueColor="text-[#CC8F33]" sub="cortes/mês" />
              <Stat value={`${m.rating}★`} sub="avaliação" />
              <Stat value={String(m.today)} sub="hoje" />
            </View>

            <TouchableOpacity className="bg-[#1B1B1B] rounded-xl p-3 flex-row items-center">
              <View className="flex-1">
                <Text className="text-[#988C81] text-xs mb-0.5">{m.status === "Folga" ? "Próximo dia de trabalho" : "Horário de Trabalho"}</Text>
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
  <View className="flex-1 bg-[#110F0E] rounded-xl py-3 items-center">
    <Text className={`font-bold text-lg ${valueColor}`}>{value}</Text>
    <Text className="text-[#988C81] text-[11px] mt-0.5">{sub}</Text>
  </View>
);
