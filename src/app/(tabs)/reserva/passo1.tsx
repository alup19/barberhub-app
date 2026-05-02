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
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.replace("/home")} />
      <Stepper current={1} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, gap: 18 }}>
        <Text className="text-white text-sm">Escolha o barbeiro e o serviço para o seu agendamento.</Text>

        <View>
          <Text className="text-white text-base font-semibold mb-3">1. Selecione o barbeiro</Text>
          {barber ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setBarber(null);
                setService(null);
              }}
              className="bg-bg-card rounded-2xl p-4 flex-row items-center border border-gold"
            >
              <View className="w-12 h-12 rounded-full bg-gold items-center justify-center">
                <Text className="text-bg font-bold">{barber.initials}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold">{barber.name}</Text>
                <Text className="text-muted text-xs">{barber.role}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={12} color="#d4a24c" />
                  <Text className="text-white text-xs ml-1">{barber.rating}</Text>
                  <Text className="text-muted text-xs ml-1">({barber.reviews} avaliações)</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => { setBarber(null); setService(null); }} className="p-2">
                <Ionicons name="close" size={20} color="#9a9a9a" />
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
                  className={`bg-bg-card rounded-2xl p-4 flex-row items-center border border-line ${disabled ? "opacity-60" : ""}`}
                >
                  <View className="w-12 h-12 rounded-full bg-gold items-center justify-center">
                    <Text className="text-bg font-bold">{b.initials}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{b.name}</Text>
                    <Text className="text-muted text-xs">{b.role}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={12} color="#d4a24c" />
                      <Text className="text-white text-xs ml-1">{b.rating}</Text>
                      <Text className="text-muted text-xs ml-1">({b.reviews} avaliações)</Text>
                    </View>
                  </View>
                  {disabled && (
                    <View className="bg-danger/20 px-2 py-0.5 rounded-full">
                      <Text className="text-danger text-xs font-semibold">Indisponível</Text>
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
                  className={`bg-bg-card rounded-2xl p-4 flex-row items-center border ${selected ? "border-gold" : "border-line"}`}
                >
                  <View className="w-11 h-11 rounded-xl bg-gold/15 items-center justify-center">
                    <Ionicons name="cut-outline" size={20} color="#d4a24c" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{s.name}</Text>
                    <Text className="text-muted text-xs mt-1">{s.description}</Text>
                  </View>
                  <Text className={`text-sm font-semibold ${selected ? "text-gold" : "text-white"}`}>R$ {s.price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {barber && service ? (
        <View className="absolute bottom-0 left-0 right-0 bg-bg border-t border-line p-5">
          <PrimaryButton label="Continuar para data e horário" icon="arrow-forward" onPress={() => router.push("/reserva/passo2")} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
