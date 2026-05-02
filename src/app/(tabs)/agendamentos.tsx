import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";
import { Appointment, appointments as initial } from "../../constants/data";

const tabs = ["Próximos", "Concluídos", "Cancelados"] as const;
type Tab = typeof tabs[number];

const tabToStatus: Record<Tab, Appointment["status"][]> = {
  Próximos: ["Agendado"],
  Concluídos: ["Concluído"],
  Cancelados: ["Cancelado"],
};

export default function Appointments() {
  const [tab, setTab] = useState<Tab>("Próximos");
  const [items, setItems] = useState<Appointment[]>(() => initial as Appointment[]);

  const list = items.filter((a) => tabToStatus[tab].includes(a.status));

  const cancel = (id: string) =>
    Alert.alert("Cancelar agendamento", "Deseja cancelar este agendamento?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", style: "destructive", onPress: () => setItems((p) => p.map((a) => (a.id === id ? { ...a, status: "Cancelado" } : a))) },
    ]);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <Text className="text-3xl text-white mt-2 mx-5" style={{ fontFamily: "serif" }}>
        Meus Agendamentos
      </Text>

      <View className="flex-row bg-bg-card mx-5 mt-4 p-1 rounded-full border border-line">
        {tabs.map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity key={t} onPress={() => setTab(t)} className={`flex-1 py-2 rounded-full ${active ? "bg-gold" : ""}`}>
              <Text className={`text-center text-sm ${active ? "text-bg font-bold" : "text-muted"}`}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="text-muted text-xs mx-5 mt-3">{list.length} agendamento(s) encontrados</Text>

      <ScrollView className="mt-3" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 14 }}>
        {list.map((a) => {
          const isUpcoming = a.status === "Agendado";
          const statusColor =
            a.status === "Agendado" ? "bg-gold/20 text-gold" : a.status === "Concluído" ? "bg-success/20 text-success" : "bg-danger/20 text-danger";
          return (
            <View key={a.id} className="bg-bg-card rounded-2xl p-4 border border-line">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-gold items-center justify-center">
                  <Text className="text-bg font-bold">{a.initials}</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">{a.service}</Text>
                  <Text className="text-muted text-xs">{a.barber}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gold font-bold">R$ {a.price}</Text>
                  <View className={`px-2 py-0.5 rounded-full mt-1 ${statusColor.split(" ")[0]}`}>
                    <Text className={`text-xs font-semibold ${statusColor.split(" ")[1]}`}>{a.status}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-bg-elevated rounded-xl p-3 mt-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#9a9a9a" />
                <Text className="text-muted text-xs ml-1.5">{a.date}</Text>
                <View className="w-1 h-1 rounded-full bg-muted mx-3" />
                <Ionicons name="time-outline" size={14} color="#9a9a9a" />
                <Text className="text-muted text-xs ml-1.5">
                  {a.time} · {a.duration} min
                </Text>
              </View>

              {isUpcoming && (
                <View className="flex-row gap-3 mt-3">
                  <TouchableOpacity onPress={() => cancel(a.id)} className="flex-1 flex-row items-center justify-center py-3 rounded-xl border border-danger/40 bg-danger/10">
                    <Ionicons name="close" size={16} color="#ef4444" />
                    <Text className="text-danger ml-1 font-semibold">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-gold">
                    <Ionicons name="arrow-forward" size={16} color="#0a0a0a" />
                    <Text className="text-bg ml-1 font-bold">Reagendar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNavigator active="appointments" />
    </SafeAreaView>
  );
}
