import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";

export default function Confirm() {
  const { barber, service, date, time } = useBooking();
  if (!barber || !service) return null;

  const cabelo = service.name.toLowerCase().includes("corte") ? 35 : 0;
  const barba = service.name.toLowerCase().includes("barba") ? 25 : 0;
  const desconto = cabelo > 0 && barba > 0 ? 5 : 0;
  const subtotal = cabelo + barba || service.price;
  const total = subtotal - desconto;

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.back()} />
      <Stepper current={3} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, gap: 14 }}>
        <View className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#3A3A3A] mt-3">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-[#988C81] text-xs uppercase">Seu agendamento</Text>
              <Text className="text-white text-xl mt-1" style={{ fontFamily: "serif" }}>
                {service.name}
              </Text>
            </View>
            <View className="bg-[#CC8F33] rounded-xl px-3 py-1.5">
              <Text className="text-black font-bold">R$ {total}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4">
            <View className="w-10 h-10 rounded-full bg-[#CC8F3320] items-center justify-center">
              <Text className="text-[#CC8F33] font-bold text-xs">{barber.initials}</Text>
            </View>
            <View className="ml-3">
              <Text className="text-white font-semibold">{barber.name}</Text>
              <Text className="text-[#988C81] text-xs">
                {barber.role} · ★ {barber.rating}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <View className="w-10 h-10 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="calendar-outline" size={18} color="#D4A24C" />
            </View>
            <View className="ml-3">
              <Text className="text-white">{date}</Text>
              <Text className="text-[#988C81] text-xs">às {time} · duração: {service.duration} min</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <View className="w-10 h-10 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="location-outline" size={18} color="#D4A24C" />
            </View>
            <View className="ml-3">
              <Text className="text-white">Nome da Barbearia</Text>
              <Text className="text-[#988C81] text-xs">Rua da UniSenac, 123 — Cidade</Text>
            </View>
          </View>
        </View>

        <View className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#3A3A3A]">
          <Text className="text-[#988C81] text-xs uppercase mb-3">Resumo de valores</Text>
          {cabelo > 0 && <Row label="Corte de cabelo" value={`R$ ${cabelo},00`} />}
          {barba > 0 && <Row label="Barba" value={`R$ ${barba},00`} />}
          {desconto > 0 && <Row label="Desconto combo" value={`- R$ ${desconto},00`} success />}
          {cabelo === 0 && barba === 0 && <Row label={service.name} value={`R$ ${service.price},00`} />}
          <View className="h-px bg-[#3A3A3A] my-3" />
          <View className="flex-row justify-between">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-[#CC8F33] text-lg font-bold">R$ {total}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#110F0E] border-t border-[#3A3A3A] p-5">
        <PrimaryButton label="✓ Confirmar Agendamento" onPress={() => router.replace("/reserva/sucesso")} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <View className="flex-row justify-between mb-2">
      <Text className="text-[#988C81]">{label}</Text>
      <Text style={{ color: success ? "#22C55E" : "#fff" }}>{value}</Text>
    </View>
  );
}