import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";

const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function Success() {
  const { usuario } = useAuth();
  const { barber, service, date, time, reset } = useBooking();

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ring, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ),
    ]).start();
  }, []);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });

  // date vem como ISO string do Step2
  const dataFormatada = date
    ? `${new Date(date).getDate()} de ${monthNames[new Date(date).getMonth()]}`
    : "—";

  const irPara = (path: string) => {
    reset(); // só limpa o contexto ao SAIR dessa tela, não antes
    router.replace(path);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 justify-center">
        <View className="items-center">
          <View style={{ width: 96, height: 96, alignItems: "center", justifyContent: "center" }}>
            <Animated.View
              style={{
                position: "absolute",
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#22C55E30",
                transform: [{ scale: ringScale }],
                opacity,
              }}
            />
            <Animated.View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#22C55E20",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale }],
              }}
            >
              <Ionicons name="checkmark" size={56} color="#22C55E" />
            </Animated.View>
          </View>

          <Text className="text-white text-3xl mt-6" style={{ fontFamily: "serif" }}>
            Agendado!
          </Text>
          <Text className="text-[#988C81] text-center mt-2 leading-5">
            {usuario?.nome ? usuario.nome.split(" ")[0] : "Você"}, seu horário foi confirmado com sucesso.{"\n"}Você receberá uma notificação de lembrete.
          </Text>
        </View>

        <View className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#3A3A3A] mt-8">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
              <Text className="text-[#CC8F33] font-bold">{barber?.nome.substring(0, 1) ?? "?"}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold">{barber?.nome ?? "—"}</Text>
              <Text className="text-[#988C81] text-xs">{barber?.funcao ?? "—"}</Text>
            </View>
            <View className="w-7 h-7 rounded-full bg-[#22C55E20] items-center justify-center">
              <Ionicons name="checkmark" size={16} color="#22C55E" />
            </View>
          </View>

          <View className="h-px bg-[#3A3A3A] my-4" />

          <Detail icon="cut-outline" label="Serviço" value={service?.nome ?? "—"} />
          <Detail icon="calendar-outline" label="Data" value={dataFormatada} />
          <Detail icon="time-outline" label="Horário" value={time ?? "—"} />

          <View className="h-px bg-[#3A3A3A] my-4" />
          <View className="flex-row justify-between">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-[#CC8F33] text-xl font-bold">
              R$ {service ? service.preco.toFixed(2).replace(".", ",") : "0,00"}
            </Text>
          </View>
        </View>

        <View className="mt-8 gap-3">
          <PrimaryButton
            label="Ver agendamentos"
            onPress={() => irPara("/agendamentos")}
          />
          <PrimaryButton
            label="Voltar ao início"
            variant="outline"
            onPress={() => irPara("/home")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Detail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View className="flex-row items-center py-1.5">
      <Ionicons name={icon} size={16} color="#D4A24C" />
      <Text className="text-[#988C81] ml-2 flex-1">{label}</Text>
      <Text className="text-white font-semibold">{value}</Text>
    </View>
  );
}