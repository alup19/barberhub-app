import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";
import { barbers, services } from "../../../constants/data";

export default function Step1() {
  const { barber, service, setBarber, setService } = useBooking();

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.replace("/home")} />
      <Stepper current={1} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, gap: 18 }}>
        <Text className="text-[#988C81] text-sm">Escolha o barbeiro e o serviço para o seu agendamento.</Text>

        <View>
          <Text className="text-white text-base font-semibold mb-3">1. Selecione o barbeiro</Text>
          {barber ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { setBarber(null); setService(null); }}
              className="bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border border-[#CC8F33]"
            >
              <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                <Text className="text-[#CC8F33] font-bold">{barber.initials}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold">{barber.name}</Text>
                <Text className="text-[#988C81] text-xs">{barber.role}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={12} color="#D4A24C" />
                  <Text className="text-white text-xs ml-1">{barber.rating}</Text>
                  <Text className="text-[#988C81] text-xs ml-1">({barber.reviews} avaliações)</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => { setBarber(null); setService(null); }} className="p-2">
                <Ionicons name="close" size={20} color="#9A9AA5" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            barbers.map((b) => {
              const disabled = !b.available;
              return (
                <TouchableOpacity
                  key={b.id}
                  disabled={disabled}
                  activeOpacity={0.85}
                  onPress={() => setBarber(b)}
                  className={`bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border border-[#3A3A3A] mb-3 ${disabled ? "opacity-60" : ""}`}
                >
                  <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                    <Text className="text-[#CC8F33] font-bold">{b.initials}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{b.name}</Text>
                    <Text className="text-[#988C81] text-xs">{b.role}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={12} color="#D4A24C" />
                      <Text className="text-white text-xs ml-1">{b.rating}</Text>
                      <Text className="text-[#988C81] text-xs ml-1">({b.reviews} avaliações)</Text>
                    </View>
                  </View>
                  {disabled && (
                    <View className="bg-[#E5484D20] px-2 py-0.5 rounded-full">
                      <Text className="text-[#E5484D] text-xs font-semibold">Indisponível</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {barber && (
          <View>
            <Text className="text-white text-base font-semibold mb-3">2. Selecione o serviço</Text>
            {services.map((s) => {
              const selected = service?.id === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.85}
                  onPress={() => setService(s)}
                  className={`bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border mb-3 ${selected ? "border-[#CC8F33]" : "border-[#3A3A3A]"}`}
                >
                  <View className="w-11 h-11 rounded-xl bg-[#CC8F3320] items-center justify-center">
                    <Ionicons name="cut-outline" size={20} color="#D4A24C" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{s.name}</Text>
                    <Text className="text-[#988C81] text-xs mt-1">{s.description}</Text>
                  </View>
                  <Text className={`text-sm font-semibold ${selected ? "text-[#CC8F33]" : "text-white"}`}>R$ {s.price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {barber && service ? (
        <View className="absolute bottom-0 left-0 right-0 bg-[#110F0E] border-t border-[#3A3A3A] p-5">
          <PrimaryButton label="Continuar para data e horário" icon="arrow-forward" onPress={() => router.push("/reserva/passo2")} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}