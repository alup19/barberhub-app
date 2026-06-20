import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Servico = {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  duracaoMin: number;
  categoria: string;
  ativo: boolean;
};

const CATEGORIAS = ["Todos", "Cabelo", "Barba", "Sobrancelha", "Tratamento", "Estética", "Premium"] as const;
type Cat = typeof CATEGORIAS[number];

const CATEGORIA_PARA_ENUM: Record<string, string> = {
  Cabelo: "CABELO",
  Barba: "BARBA",
  Sobrancelha: "SOBRANCELHA",
  Tratamento: "TRATAMENTO",
  Estética: "ESTETICA",
  Premium: "PREMIUM",
};

const ICONE_CATEGORIA: Record<string, keyof typeof Ionicons.glyphMap> = {
  CABELO: "cut-outline",
  BARBA: "man-outline",
  SOBRANCELHA: "eye-outline",
  TRATAMENTO: "leaf-outline",
  ESTETICA: "sparkles-outline",
  PREMIUM: "star-outline",
};

export default function Services() {
  const { usuario, fetchComAuth } = useAuth();
  const [cat, setCat] = useState<Cat>("Todos");
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarServicos();
    }, [])
  );

  const carregarServicos = async () => {
    setLoading(true);
    try {
      const response = await fetchComAuth(`${apiUrl}/servicos/barbearia/${usuario?.barbeariaId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao buscar serviços");

      setServicos(
        data
          .filter((s: Servico) => s.ativo)
          .map((s: Servico) => ({ ...s, preco: Number(s.preco) }))
      );
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const list =
    cat === "Todos" ? servicos : servicos.filter((s) => s.categoria === CATEGORIA_PARA_ENUM[cat]);

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <Text className="text-3xl text-white mt-2 mx-5 pt-8" style={{ fontFamily: "serif" }}>
        Serviços
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 max-h-12" contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {CATEGORIAS.map((c) => {
          const active = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              className={`px-5 h-10 rounded-full items-center justify-center ${active ? "bg-[#CC8F33]" : "bg-[#1B1B1B] border border-[#3A3A3A]"}`}
            >
              <Text className={active ? "text-black font-bold" : "text-[#988C81]"}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}>
        {loading && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Carregando...</Text>
          </View>
        )}

        {!loading && list.length === 0 && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Nenhum serviço encontrado</Text>
          </View>
        )}

        {list.map((s) => {
          const isPremium = s.categoria === "PREMIUM";
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => router.push("/reserva/passo1")}
              className="bg-[#1B1B1B] rounded-2xl p-4 flex-row items-center border border-[#3A3A3A]"
            >
              <View className="w-12 h-12 rounded-xl bg-[#CC8F3320] items-center justify-center mr-3">
                <Ionicons name={ICONE_CATEGORIA[s.categoria] ?? "cut-outline"} size={22} color="#D4A24C" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold flex-1">{s.nome}</Text>
                  {isPremium && (
                    <View className="bg-[#CC8F3320] px-2 py-0.5 rounded-full">
                      <Text className="text-[#CC8F33] text-xs font-semibold">Premium</Text>
                    </View>
                  )}
                </View>
                {s.descricao && <Text className="text-[#988C81] text-xs mt-1">{s.descricao}</Text>}
                <View className="flex-row items-center mt-2 gap-3">
                  <Text className="text-[#CC8F33] font-bold text-lg">R$ {s.preco.toFixed(2).replace(".", ",")}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={12} color="#988C81" />
                    <Text className="text-[#988C81] text-xs ml-1">{s.duracaoMin} min</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9A9AA5" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <BottomNavigator active="servicos" />
    </SafeAreaView>
  );
}