import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarberRow } from "../../components/BarberRow";
import { BottomNavigator } from "../../components/BottomNavigator";
import { ServiceCard } from "../../components/ServiceCard";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const GRADIENT_COLORS = ["#CC8F33", "#c79a3e", "#e2b558"] as const;

// Endereço fixo por enquanto, até a barbearia ter isso no backend
const ENDERECO_BARBEARIA = "Rua das Flores, 123 - Centro";

type Servico = {
  id: number;
  nome: string;
  preco: number;
  duracaoMin: number;
  categoria: string;
  ativo: boolean;
};

type Barbeiro = {
  id: number;
  nome: string;
  funcao: string;
  ativo: boolean;
};

const ICONE_CATEGORIA: Record<string, keyof typeof Ionicons.glyphMap> = {
  CABELO: "cut-outline",
  BARBA: "man-outline",
  SOBRANCELHA: "eye-outline",
  TRATAMENTO: "leaf-outline",
  ESTETICA: "sparkles-outline",
  PREMIUM: "star-outline",
};

export default function Home() {
  const { usuario, fetchComAuth } = useAuth();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [temAgendamentoAnterior, setTemAgendamentoAnterior] = useState(true); // true por padrão = esconde o banner até confirmar

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const [resServicos, resBarbeiros, resAgendamentos] = await Promise.all([
        fetchComAuth(`${apiUrl}/servicos/barbearia/${usuario?.barbeariaId}`),
        fetchComAuth(`${apiUrl}/barbeiros/barbearia/${usuario?.barbeariaId}`),
        fetchComAuth(`${apiUrl}/agendamentos/${usuario?.id}`),
      ]);

      const dataServicos = await resServicos.json();
      const dataBarbeiros = await resBarbeiros.json();
      const dataAgendamentos = await resAgendamentos.json();

      if (resServicos.ok) {
        setServicos(
          dataServicos
            .filter((s: Servico) => s.ativo)
            .map((s: Servico) => ({ ...s, preco: Number(s.preco) }))
        );
      }

      if (resBarbeiros.ok) {
        setBarbeiros(dataBarbeiros.filter((b: Barbeiro) => b.ativo));
      }

      if (resAgendamentos.ok) {
        setTemAgendamentoAnterior(dataAgendamentos.length > 0);
      }
    } catch (error) {
      console.error("Erro ao carregar dados da home:", error);
    }
  };

  const servicosPrincipais = servicos.slice(0, 4);
  const serviceRows = [servicosPrincipais.slice(0, 2), servicosPrincipais.slice(2, 4)];
  const barbeirosPrincipais = barbeiros.slice(0, 3);

  const abrirMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_BARBEARIA)}`;
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 bg-bg bg-[#110F0E] pt-8">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          className="pb-2"
        >
          <View className="px-6 pt-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-text-muted text-[#988C81] text-base">Bem-vindo 👋</Text>
              <Text className="text-text text-white text-2xl mt-1">{usuario?.nome || "Usuário"}</Text>
            </View>

            <Pressable className="w-11 h-11 rounded-full bg-bg-card items-center justify-center mr-3 border bg-[#292623] border-white/5">
              <Ionicons name="notifications-outline" size={20} color="#f5ecd9" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
            </Pressable>

            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#0a0805", fontWeight: "bold" }}>
                {usuario?.nome ? usuario.nome.substring(0, 2).toUpperCase() : "US"}
              </Text>
            </LinearGradient>
          </View>

          {!temAgendamentoAnterior ? (
            <View className="px-6 mt-6">
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 20, padding: 20 }}
              >
                <Text className="text-[#110F0E]/70 text-xs font-bold tracking-widest">OFERTA ESPECIAL</Text>
                <Text className="font-serif text-[#110F0E] text-5xl mt-2">20% OFF</Text>
                <Text className="text-[#110F0E]/80 text-sm mt-1">No primeiro agendamento</Text>
                <Pressable onPress={() => router.push("/reserva/passo1")} className="bg-[#110F0E] self-start mt-4 rounded-xl px-4 py-2.5">
                  <Text className="text-[#CC8F33] font-semibold text-sm">Agendar agora</Text>
                </Pressable>
              </LinearGradient>
            </View>
          ) : (
            <View className="px-6 mt-6">
              <LinearGradient
                colors={["#1C1A17", "#252118", "#1C1A17"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#CC8F3340" }}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                    <Ionicons name="cut" size={22} color="#CC8F33" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-white text-lg font-bold" style={{ fontFamily: "Arial" }}>
                      Barber Premium
                    </Text>
                    <Text className="text-[#988C81] text-base mt-0.5">Estilo e tradição em cada corte</Text>
                  </View>
                </View>

                <View className="h-px bg-[#3A3A3A] my-4" />

                <Pressable onPress={() => router.push("/reserva/passo1")} className="flex-row items-center justify-between">
                  <Text className="text-[#CC8F33] font-semibold text-sm">Agendar um novo horário</Text>
                  <Ionicons name="arrow-forward" size={16} color="#CC8F33" />
                </Pressable>
              </LinearGradient>
            </View>
          )}

          <View className="px-6 mt-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-text text-white text-2xl">Serviços</Text>
              <Pressable onPress={() => router.push("/servicos")} className="flex-row items-center gap-1">
                <Text className="text-[#CC8F33] text-sm font-semibold">Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#CC8F33" />
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {serviceRows.map((row, index) => (
                <View key={index} className="flex-row gap-3">
                  {row.map((service) => (
                    <ServiceCard
                      key={service.id}
                      icon={ICONE_CATEGORIA[service.categoria] ?? "cut-outline"}
                      title={service.nome}
                      price={service.preco.toFixed(2).replace(".", ",")}
                      duration={`${service.duracaoMin} min`}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View className="px-6 mt-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-text text-white text-2xl">Barbeiros</Text>
              <Pressable onPress={() => router.push("/reserva/passo1")} className="flex-row items-center gap-1">
                <Text className="text-[#CC8F33] text-sm font-semibold">Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#CC8F33" />
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {barbeirosPrincipais.map((barber) => (
                <BarberRow
                  key={barber.id}
                  initial={barber.nome.substring(0, 1)}
                  name={barber.nome}
                  role={barber.funcao}
                  rating="—"
                />
              ))}
            </View>
          </View>

          <View className="px-6 mt-6">
            <Pressable onPress={abrirMaps} className="flex-row items-center bg-bg-card bg-[#1C1A17] rounded-2xl p-4 border border-white/5">
              <View className="w-10 h-10 rounded-xl bg-[#4d36149f] items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#e2b558" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-text text-white font-semibold">Barber Premium</Text>
                <Text className="text-text-muted text-[#988C81] text-xs mt-0.5">{ENDERECO_BARBEARIA}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#a89a7e" />
            </Pressable>
          </View>
        </ScrollView>

        <BottomNavigator active="home" />
      </SafeAreaView>
    </View>
  );
}