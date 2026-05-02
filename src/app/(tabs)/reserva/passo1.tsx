import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../../components/BookingContext";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";
import { barbers } from "../../../constants/data";

export default function Step1() {
  const { setBarber } = useBooking();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.replace("/home")} />
      <Stepper current={1} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
        {barbers.map((b) => {
          const disabled = !b.available;
          return (
            <TouchableOpacity
              key={b.id}
              disabled={disabled}
              activeOpacity={0.85}
              onPress={() => {
                setBarber(b);
                router.push("/reserva/passo2");
              }}
              className={`bg-bg-card rounded-2xl p-4 flex-row items-center border ${disabled ? "border-line opacity-60" : "border-line"}`}
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
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
