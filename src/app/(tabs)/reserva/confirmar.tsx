import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function Confirm() {
  const { usuario, fetchComAuth } = useAuth();
  const { barber, service, date, time, reset } = useBooking();
  const [loading, setLoading] = useState(false);

  if (!barber || !service || !date || !time) return null;

  // date foi salvo como ISO string no Step2
  const dataObj = new Date(date);
  const dataFormatada = `${dataObj.getDate()} de ${monthNames[dataObj.getMonth()]}`;

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      // Monta o dataHora final combinando a data (Step2) com a hora (HH:MM) selecionada
      const [horas, minutos] = time.split(":").map(Number);
      const dataHoraFinal = new Date(dataObj);
      dataHoraFinal.setHours(horas, minutos, 0, 0);

      const response = await fetchComAuth(`${apiUrl}/agendamentos`, {
        method: "POST",
        body: JSON.stringify({
          dataHora: dataHoraFinal.toISOString(),
          usuarioId: usuario?.id,
          servicoId: service.id,
          barbeariaId: usuario?.barbeariaId,
          barbeiroId: barber.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao confirmar agendamento");
      }

      router.replace("/reserva/sucesso");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao confirmar",
        text2: error.message || "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

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
                {service.nome}
              </Text>
            </View>
            <View className="bg-[#CC8F33] rounded-xl px-3 py-1.5">
              <Text className="text-black font-bold">R$ {service.preco.toFixed(2).replace(".", ",")}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4">
            <View className="w-10 h-10 rounded-full bg-[#CC8F3320] items-center justify-center">
              <Text className="text-[#CC8F33] font-bold text-xs">{barber.nome.substring(0, 1)}</Text>
            </View>
            <View className="ml-3">
              <Text className="text-white font-semibold">{barber.nome}</Text>
              <Text className="text-[#988C81] text-xs">{barber.funcao}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <View className="w-10 h-10 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="calendar-outline" size={18} color="#D4A24C" />
            </View>
            <View className="ml-3">
              <Text className="text-white">{dataFormatada}</Text>
              <Text className="text-[#988C81] text-xs">às {time} · duração: {service.duracaoMin} min</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <View className="w-10 h-10 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="location-outline" size={18} color="#D4A24C" />
            </View>
            <View className="ml-3">
              <Text className="text-white">Sua barbearia</Text>
              {service.descricao && <Text className="text-[#988C81] text-xs">{service.descricao}</Text>}
            </View>
          </View>
        </View>

        <View className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#3A3A3A]">
          <Text className="text-[#988C81] text-xs uppercase mb-3">Resumo de valores</Text>
          <Row label={service.nome} value={`R$ ${service.preco.toFixed(2).replace(".", ",")}`} />
          <View className="h-px bg-[#3A3A3A] my-3" />
          <View className="flex-row justify-between">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-[#CC8F33] text-lg font-bold">R$ {service.preco.toFixed(2).replace(".", ",")}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#110F0E] border-t border-[#3A3A3A] p-5">
        <PrimaryButton
          label={loading ? "Confirmando..." : "✓ Confirmar Agendamento"}
          disabled={loading}
          onPress={handleConfirmar}
        />
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