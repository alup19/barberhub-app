import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";
import { Appointment, userAppointments as initial } from "../../constants/data";

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
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <Text className="text-3xl text-white mt-2 mx-5 pt-8" style={{ fontFamily: "serif" }}>
        Meus Agendamentos
      </Text>

      <View className="flex-row bg-[#1B1B1B] mx-5 mt-4 p-1 rounded-full border border-[#3A3A3A]">
        {tabs.map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2 rounded-full ${active ? "bg-[#CC8F33]" : ""}`}
            >
              <Text className={`text-center text-sm ${active ? "text-black font-bold" : "text-[#988C81]"}`}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="text-[#988C81] text-xs mx-5 mt-3">{list.length} agendamento(s) encontrados</Text>

      <ScrollView className="mt-3" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 14 }}>
        {list.map((a) => {
          const isUpcoming = a.status === "Agendado";
          const statusBg =
            a.status === "Agendado" ? "bg-[#CC8F3320]" :
            a.status === "Concluído" ? "bg-[#22C55E20]" :
            "bg-[#E5484D20]";
          const statusText =
            a.status === "Agendado" ? "text-[#CC8F33]" :
            a.status === "Concluído" ? "text-[#22C55E]" :
            "text-[#E5484D]";

          return (
            <View key={a.id} className="bg-[#1B1B1B] rounded-2xl p-4 border border-[#3A3A3A]">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                  <Text className="text-[#CC8F33] font-bold">{a.initials}</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">{a.service}</Text>
                  <Text className="text-[#988C81] text-xs">{a.barber}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[#CC8F33] font-bold text-lg">R$ {a.price}</Text>
                  <View className={`px-2 py-0.5 rounded-full mt-1 ${statusBg}`}>
                    <Text className={`text-xs font-semibold ${statusText}`}>{a.status}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-[#252525] rounded-xl p-3 mt-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#988C81" />
                <Text className="text-[#988C81] text-xs ml-1.5">{a.date}</Text>
                <View className="w-1 h-1 rounded-full bg-[#988C81] mx-3" />
                <Ionicons name="time-outline" size={14} color="#988C81" />
                <Text className="text-[#988C81] text-xs ml-1.5">
                  {a.time} · {a.duration} min
                </Text>
              </View>

              {isUpcoming && (
                <View className="flex-row gap-3 mt-3">
                  <TouchableOpacity
                    onPress={() => cancel(a.id)}
                    className="flex-1 flex-row items-center justify-center py-3 rounded-xl border border-[#E5484D40] bg-[#E5484D10]"
                  >
                    <Ionicons name="close" size={16} color="#E5484D" />
                    <Text className="text-[#E5484D] ml-1 font-semibold">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-[#CC8F33]">
                    <Ionicons name="arrow-forward" size={16} color="#000" />
                    <Text className="text-black ml-1 font-bold">Reagendar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNavigator active="agendamentos" />
    </SafeAreaView>
  );
}