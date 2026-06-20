import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BottomNavigator } from "../../components/BottomNavigator";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Agendamento = {
  id: number;
  dataHora: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
  observacao: string | null;
  servico: { nome: string; preco: number; duracaoMin: number };
  barbeiro: { nome: string };
};

const tabs = ["Próximos", "Concluídos", "Cancelados"] as const;
type Tab = typeof tabs[number];

const tabToStatus: Record<Tab, Agendamento["status"]> = {
  Próximos: "PENDENTE",
  Concluídos: "CONCLUIDO",
  Cancelados: "CANCELADO",
};

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function Appointments() {
  const { usuario, fetchComAuth } = useAuth();
  const [tab, setTab] = useState<Tab>("Próximos");
  const [items, setItems] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await fetchComAuth(`${apiUrl}/agendamentos/${usuario?.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao buscar agendamentos");

      // Normaliza o preço (vem como string do Prisma Decimal)
      const normalizado = data.map((a: any) => ({
        ...a,
        servico: { ...a.servico, preco: Number(a.servico.preco) },
      }));

      setItems(normalizado);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar agendamentos", text2: error.message || "Tente novamente" });
    } finally {
      setLoading(false);
    }
  };

  const list = items.filter((a) => a.status === tabToStatus[tab]);

  const cancelar = (id: number) =>
    Alert.alert("Cancelar agendamento", "Deseja cancelar este agendamento?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetchComAuth(`${apiUrl}/agendamentos/${id}`, {
              method: "PUT",
              body: JSON.stringify({ status: "CANCELADO" }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.erro || "Erro ao cancelar");

            Toast.show({ type: "success", text1: "Agendamento cancelado" });
            carregarAgendamentos();
          } catch (error: any) {
            Toast.show({ type: "error", text1: "Erro ao cancelar", text2: error.message || "Tente novamente" });
          }
        },
      },
    ]);

  const formatarData = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} de ${monthNames[d.getMonth()]}`;
  };

  const formatarHora = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <Text className="text-3xl text-white mt-2 mx-5 pt-8" style={{ fontFamily: "serif" }}>
        Meus Agendamentos
      </Text>

      <View className="flex-row bg-[#1B1B1B] mx-5 mt-4 p-1 rounded-full border border-[#3A3A3A]">
        {tabs.map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2 rounded-full ${active ? "bg-[#CC8F33]" : ""}`}
            >
              <Text className={`text-center text-sm ${active ? "text-black font-bold" : "text-[#988C81]"}`}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="text-[#988C81] text-xs mx-5 mt-3">
        {loading ? "Carregando..." : `${list.length} agendamento(s) encontrados`}
      </Text>

      <ScrollView className="mt-3" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 14 }}>
        {!loading && list.length === 0 && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Nenhum agendamento encontrado</Text>
          </View>
        )}

        {list.map((a) => {
          const isUpcoming = a.status === "PENDENTE";
          const statusLabel =
            a.status === "PENDENTE" ? "Agendado" :
              a.status === "CONCLUIDO" ? "Concluído" :
                "Cancelado";
          const statusBg =
            a.status === "PENDENTE" ? "bg-[#CC8F3320]" :
              a.status === "CONCLUIDO" ? "bg-[#22C55E20]" :
                "bg-[#E5484D20]";
          const statusText =
            a.status === "PENDENTE" ? "text-[#CC8F33]" :
              a.status === "CONCLUIDO" ? "text-[#22C55E]" :
                "text-[#E5484D]";

          return (
            <View key={a.id} className="bg-[#1B1B1B] rounded-2xl p-4 border border-[#3A3A3A]">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
                  <Text className="text-[#CC8F33] font-bold">{a.barbeiro.nome.substring(0, 1)}</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold">{a.servico.nome}</Text>
                  <Text className="text-[#988C81] text-xs">{a.barbeiro.nome}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[#CC8F33] font-bold text-lg">
                    R$ {Number(a.servico.preco).toFixed(2).replace(".", ",")}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full mt-1 ${statusBg}`}>
                    <Text className={`text-xs font-semibold ${statusText}`}>{statusLabel}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-[#252525] rounded-xl p-3 mt-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#988C81" />
                <Text className="text-[#988C81] text-xs ml-1.5">{formatarData(a.dataHora)}</Text>
                <View className="w-1 h-1 rounded-full bg-[#988C81] mx-3" />
                <Ionicons name="time-outline" size={14} color="#988C81" />
                <Text className="text-[#988C81] text-xs ml-1.5">
                  {formatarHora(a.dataHora)} · {a.servico.duracaoMin} min
                </Text>
              </View>

              {isUpcoming && (
                <View className="flex-row gap-3 mt-3">
                  <TouchableOpacity
                    onPress={() => cancelar(a.id)}
                    className="flex-1 flex-row items-center justify-center py-3 rounded-xl border border-[#E5484D40] bg-[#E5484D10]"
                  >
                    <Ionicons name="close" size={16} color="#E5484D" />
                    <Text className="text-[#E5484D] ml-1 font-semibold">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNavigator active="agendamentos" />
    </SafeAreaView>
  );
}