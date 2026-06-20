import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { Barbeiro, Servico, useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Step1() {
  const { usuario, fetchComAuth } = useAuth();
  const { barber, service, setBarber, setService } = useBooking();

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resBarbeiros, resServicos] = await Promise.all([
        fetchComAuth(`${apiUrl}/barbeiros/barbearia/${usuario?.barbeariaId}`),
        fetchComAuth(`${apiUrl}/servicos/barbearia/${usuario?.barbeariaId}`),
      ]);

      const dataBarbeiros = await resBarbeiros.json();
      const dataServicos = await resServicos.json();

      if (!resBarbeiros.ok) throw new Error(dataBarbeiros.erro || "Erro ao buscar barbeiros");
      if (!resServicos.ok) throw new Error(dataServicos.erro || "Erro ao buscar serviços");

      setBarbeiros(dataBarbeiros);
      // Só mostra serviços ativos na hora de agendar
      setServicos(dataServicos.filter((s: Servico) => s.ativo));
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.replace("/home")} />
      <Stepper current={1} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, gap: 18 }}>
        <Text className="text-[#988C81] text-sm">Escolha o barbeiro e o serviço para o seu agendamento.</Text>

        {loading && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Carregando...</Text>
          </View>
        )}

        <View>
          <Text className="text-white text-base font-semibold mb-3">1. Selecione o barbeiro</Text>

          {!loading && barbeiros.length === 0 && (
            <Text className="text-[#988C81] text-sm">Nenhum barbeiro disponível.</Text>
          )}

          {barber ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { setBarber(null); setService(null); }}
              className="bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border border-[#CC8F33]"
            >
              <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                <Text className="text-[#CC8F33] font-bold">{barber.nome.substring(0, 1)}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold">{barber.nome}</Text>
                <Text className="text-[#988C81] text-xs">{barber.funcao} · {barber.anosExp} anos de experiência</Text>
              </View>
              <TouchableOpacity onPress={() => { setBarber(null); setService(null); }} className="p-2">
                <Ionicons name="close" size={20} color="#9A9AA5" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            barbeiros.map((b) => {
              const disabled = !b.ativo;
              return (
                <TouchableOpacity
                  key={b.id}
                  disabled={disabled}
                  activeOpacity={0.85}
                  onPress={() => setBarber(b)}
                  className={`bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border border-[#3A3A3A] mb-3 ${disabled ? "opacity-60" : ""}`}
                >
                  <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                    <Text className="text-[#CC8F33] font-bold">{b.nome.substring(0, 1)}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold">{b.nome}</Text>
                    <Text className="text-[#988C81] text-xs">{b.funcao} · {b.anosExp} anos de experiência</Text>
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

            {servicos.length === 0 && (
              <Text className="text-[#988C81] text-sm">Nenhum serviço disponível.</Text>
            )}

            {servicos.map((s) => {
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
                    <Text className="text-white font-semibold">{s.nome}</Text>
                    <Text className="text-[#988C81] text-xs mt-1">{s.duracaoMin} min{s.descricao ? ` · ${s.descricao}` : ""}</Text>
                  </View>
                  <Text className={`text-sm font-semibold ${selected ? "text-[#CC8F33]" : "text-white"}`}>
                    R$ {s.preco.toFixed(2).replace(".", ",")}
                  </Text>
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