import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";
import { adminBarbers as barbers, serviceOptions } from "../../constants/data";

export default function NovoAgendamentoScreen({ onBack }: { onBack: () => void }) {
  const [barber, setBarber] = useState("João");
  const [service, setService] = useState("Corte Simples");

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Novo Agendamento" onBack={onBack} />
      <Text className="text-textmuted text-xs tracking-widest mb-4">HORÁRIO MANUAL</Text>

      <Label>Data</Label>
      <FieldRow>
        <Text className="text-white flex-1">Segunda-feira, 7 de Abril 2025</Text>
        <Ionicons name="calendar-outline" size={18} color="#D4A24C" />
      </FieldRow>

      <Label>Horário</Label>
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <View className="bg-surface border border-gold rounded-2xl px-4 py-4 flex-row items-center">
            <Text className="text-gold flex-1">10:30</Text>
            <Ionicons name="time-outline" size={18} color="#D4A24C" />
          </View>
        </View>
        <View className="flex-1">
          <View className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center">
            <Text className="text-textmuted flex-1">Duração</Text>
            <Text className="text-white mr-2">45 min</Text>
            <Ionicons name="chevron-down" size={16} color="#9A9AA5" />
          </View>
        </View>
      </View>

      <Label>Cliente</Label>
      <FieldRow>
        <Ionicons name="person-outline" size={18} color="#9A9AA5" />
        <TextInput placeholder="Buscar ou digitar nome..." placeholderTextColor="#6B6B75" className="text-white flex-1 ml-2" />
      </FieldRow>

      <Label>Barbeiro</Label>
      <View className="flex-row gap-3 mb-5">
        {barbers.map((b) => {
          const active = b === barber;
          return (
            <TouchableOpacity
              key={b}
              onPress={() => setBarber(b)}
              className={`flex-1 items-center py-3 rounded-2xl border ${active ? "border-gold bg-surface" : "border-border bg-surface"}`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${active ? "bg-goldDark" : "bg-surface2"}`}>
                <Text className={`font-bold ${active ? "text-white" : "text-textmuted"}`}>{b[0]}</Text>
              </View>
              <Text className={active ? "text-white" : "text-textmuted"}>{b}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Label>Serviço</Label>
      <View className="flex-row flex-wrap gap-2 mb-8">
        {serviceOptions.map((s) => {
          const active = s === service;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setService(s)}
              className={`px-4 py-2.5 rounded-xl border ${active ? "border-gold bg-goldDark/20" : "border-border bg-surface"}`}
            >
              <Text className={active ? "text-gold font-semibold" : "text-textmuted"}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <GoldButton title="Adicionar Agendamento" onPress={onBack} />
    </ScrollView>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-textmuted text-sm mb-2 mt-1">{children}</Text>
);
const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center mb-4">{children}</View>
);
