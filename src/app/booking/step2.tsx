import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../components/BookingContext";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import Stepper from "../../components/Stepper";
import { services } from "../../constants/data";

export default function Step2() {
  const { barber, service, setService } = useBooking();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.back()} />
      <Stepper current={2} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      {barber && (
        <View className="mx-5 mt-3 bg-bg-card rounded-2xl p-4 border border-line flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gold items-center justify-center">
            <Text className="text-bg font-bold">{barber.initials}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold">{barber.name}</Text>
            <Text className="text-muted text-xs">{barber.role}</Text>
            <View className="flex-row gap-2 mt-1.5">
              <View className="bg-gold/20 px-2 py-0.5 rounded-full">
                <Text className="text-gold text-xs font-semibold">Todos os serviços</Text>
              </View>
              <View className="bg-bg-elevated px-2 py-0.5 rounded-full">
                <Text className="text-muted text-xs">Disponível hoje</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <Text className="text-white mx-5 mt-5 text-sm">
        Selecione o serviço que deseja fazer com <Text className="font-bold">{barber?.name}</Text>.
      </Text>

      <ScrollView className="mt-3" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200, gap: 12 }}>
        {services.map((s) => {
          const selected = service?.id === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.85}
              onPress={() => setService(s)}
              className={`bg-bg-card rounded-2xl p-4 flex-row border ${selected ? "border-gold" : "border-line"}`}
            >
              <View className="w-11 h-11 rounded-xl bg-gold/15 items-center justify-center">
                <Ionicons name="cut-outline" size={20} color="#d4a24c" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold">{s.name}</Text>
                <Text className="text-muted text-xs mt-0.5">{s.description}</Text>
                <View className="flex-row gap-2 mt-2">
                  <View className="bg-bg-elevated px-2 py-1 rounded-md flex-row items-center">
                    <Ionicons name="time-outline" size={11} color="#9a9a9a" />
                    <Text className="text-muted text-xs ml-1">{s.duration} min</Text>
                  </View>
                  <View className="bg-gold/15 px-2 py-1 rounded-md">
                    <Text className="text-gold text-xs font-bold">R$ {s.price}</Text>
                  </View>
                </View>
              </View>
              <View className={`w-5 h-5 rounded-full ${selected ? "bg-gold" : "border border-line"} items-center justify-center self-center ml-2`}>
                {selected && <Ionicons name="checkmark" size={14} color="#0a0a0a" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {service && (
        <View className="absolute bottom-0 left-0 right-0 bg-bg border-t border-line p-5">
          <View className="bg-bg-card rounded-xl p-3 flex-row justify-between items-center mb-3 border border-line">
            <View>
              <Text className="text-muted text-xs uppercase">Selecionado</Text>
              <Text className="text-white font-bold">{service.name}</Text>
            </View>
            <View className="items-end">
              <Text className="text-muted text-xs">{service.duration} min</Text>
              <Text className="text-gold font-bold">R$ {service.price}</Text>
            </View>
          </View>
          <PrimaryButton label="Continuar para data e horário" icon="arrow-forward" onPress={() => router.push("/booking/step3")} />
        </View>
      )}
    </SafeAreaView>
  );
}
