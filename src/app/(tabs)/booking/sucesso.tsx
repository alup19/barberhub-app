import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";

export default function Success() {
  const { barber, service, date, time, reset } = useBooking();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 justify-center">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-success items-center justify-center">
            <Ionicons name="checkmark" size={56} color="#fff" />
          </View>
          <Text className="text-white text-3xl mt-6" style={{ fontFamily: "serif" }}>
            Agendado!
          </Text>
          <Text className="text-muted text-center mt-2 leading-5">
            João, seu horário foi confirmado com sucesso.{"\n"}Você receberá uma notificação de lembrete.
          </Text>
        </View>

        <View className="bg-bg-card rounded-2xl p-5 border border-line mt-8">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-gold items-center justify-center">
              <Text className="text-bg font-bold">{barber?.initials ?? "CS"}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold">{barber?.name ?? "Carlos Silva"}</Text>
              <Text className="text-muted text-xs">{barber?.role ?? "Master Barber"}</Text>
            </View>
            <View className="w-7 h-7 rounded-full bg-success items-center justify-center">
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          <View className="h-px bg-line my-4" />

          <Detail icon="cut-outline" label="Serviço" value={service?.name ?? "Corte + Barba"} />
          <Detail icon="calendar-outline" label="Data" value={date ?? "7 de Abril, 2026"} />
          <Detail icon="time-outline" label="Horário" value={time ?? "10:30"} />

          <View className="h-px bg-line my-4" />
          <View className="flex-row justify-between">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-gold text-xl font-bold">R$ {service?.price ?? 55}</Text>
          </View>
        </View>

        <View className="mt-8 gap-3">
          <PrimaryButton
            label="Ver agendamentos"
            onPress={() => {
              reset();
              router.replace("/appointments");
            }}
          />
          <PrimaryButton
            label="Voltar ao início"
            variant="outline"
            onPress={() => {
              reset();
              router.replace("/home");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Detail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View className="flex-row items-center py-1.5">
      <Ionicons name={icon} size={16} color="#d4a24c" />
      <Text className="text-muted ml-2 flex-1">{label}</Text>
      <Text className="text-white font-semibold">{value}</Text>
    </View>
  );
}
