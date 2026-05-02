import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";
import { timeSlots } from "../../../constants/data";

const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const dayHeaders = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - startWeekday + 1, current: false });
  return cells;
}

export default function Step3() {
  const { setDate, setTime } = useBooking();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(7);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:30");

  const cells = useMemo(() => buildMonth(year, month), [year, month]);

  const next = () => {
    const d = new Date(year, month + 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const prev = () => {
    const d = new Date(year, month - 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const canContinue = selectedDay !== null && selectedTime !== null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.back()} />
      <Stepper current={2} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}>
        <Text className="text-white text-xl mt-3 mb-3" style={{ fontFamily: "serif" }}>
          Escolha o dia
        </Text>

        <View className="bg-bg-card rounded-2xl p-4 border border-line">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={prev} className="w-9 h-9 rounded-lg bg-bg-elevated items-center justify-center">
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white font-semibold">{monthNames[month]} {year}</Text>
            <TouchableOpacity onPress={next} className="w-9 h-9 rounded-lg bg-bg-elevated items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            {dayHeaders.map((h) => (
              <View key={h} className="flex-1 items-center py-1">
                <Text className="text-muted text-xs">{h}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {cells.map((c, i) => {
              const isSelected = c.current && c.day === selectedDay;
              return (
                <TouchableOpacity
                  key={i}
                  disabled={!c.current}
                  onPress={() => c.current && setSelectedDay(c.day)}
                  style={{ width: `${100 / 7}%` }}
                  className="items-center py-2"
                >
                  <View className={`w-9 h-9 rounded-full items-center justify-center ${isSelected ? "bg-gold" : ""}`}>
                    <Text className={`${isSelected ? "text-bg font-bold" : c.current ? "text-white" : "text-muted/40"}`}>{c.day}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text className="text-white text-xl mt-6 mb-3" style={{ fontFamily: "serif" }}>
          Horários Disponíveis
        </Text>

        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {timeSlots.map((s) => {
            const sel = s.time === selectedTime && s.available;
            return (
              <TouchableOpacity
                key={s.time}
                disabled={!s.available}
                onPress={() => setSelectedTime(s.time)}
                style={{ width: "31%" }}
                className={`py-3 rounded-xl items-center border ${
                  sel ? "bg-gold border-gold" : !s.available ? "bg-bg-elevated border-line opacity-40" : "bg-bg-card border-line"
                }`}
              >
                <Text className={`${sel ? "text-bg font-bold" : "text-white"}`}>{s.time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-bg border-t border-line p-5">
        <PrimaryButton
          label="Continuar"
          icon="arrow-forward"
          disabled={!canContinue}
          onPress={() => {
            setDate(`${selectedDay} de ${monthNames[month]}`);
            setTime(selectedTime!);
            router.push("/booking/confirm");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
