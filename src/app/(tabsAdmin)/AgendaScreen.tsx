import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "@/src/context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const GRADIENT_COLORS = ["#CC8F33", "#CC8F33", "#e2b558"] as const;

type Agendamento = {
  id: number;
  dataHora: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
  usuario: { nome: string };
  servico: { nome: string; preco: number; duracaoMin: number };
};

const DIAS_SEMANA = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
const MESES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

type Props = { onNew: () => void };

export default function AgendaScreen({ onNew }: Props) {
  const { usuario, fetchComAuth } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await fetchComAuth(`${apiUrl}/agendamentos/barbearia/${usuario?.barbeariaId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao buscar agendamentos");

      setAgendamentos(
        data.map((a: any) => ({ ...a, servico: { ...a.servico, preco: Number(a.servico.preco) } }))
      );
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  const hoje = new Date();
  const agendamentosDeHoje = agendamentos
    .filter((a) => new Date(a.dataHora).toDateString() === hoje.toDateString())
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

  const totalHoje = agendamentosDeHoje.length;
  const confirmadosHoje = agendamentosDeHoje.filter((a) => a.status === "PENDENTE").length;
  const receitaHoje = agendamentosDeHoje
    .filter((a) => a.status !== "CANCELADO")
    .reduce((soma, a) => soma + a.servico.preco, 0);

  const dataFormatada = `${DIAS_SEMANA[hoje.getDay()]}-FEIRA, ${hoje.getDate()} ${MESES[hoje.getMonth()]}`;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, backgroundColor: "#110F0E" }}>
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-textmuted text-xs tracking-widest mb-1 text-[#988C81]">{dataFormatada}</Text>
          <Text className="text-white text-2xl" style={{ fontFamily: "Arial", fontWeight: "700" }}>
            Bom dia, {usuario?.nome?.split(" ")[0] || "Usuário"} ✂️
          </Text>
        </View>
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }}
        >
          <Text className="text-black font-bold">
            {usuario?.nome ? usuario.nome.substring(0, 1).toUpperCase() : "U"}
          </Text>
        </LinearGradient>
      </View>

      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81] text-xs">HOJE</Text>
          <Text className="text-white text-2xl font-bold mt-1">{totalHoje}</Text>
          <Text className="text-[#988C81] text-xs mt-1">agendamento{totalHoje !== 1 ? "s" : ""}</Text>
        </View>

        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81] text-xs">CONFIRMADOS</Text>
          <Text className="text-[#CC8F33] text-2xl font-bold mt-1">{confirmadosHoje}</Text>
          <Text className="text-[#988C81] text-sm mt-1">confirmado{confirmadosHoje !== 1 ? "s" : ""}</Text>
        </View>

        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81] text-xs">RECEITA</Text>
          <Text className="text-white text-2xl font-bold mt-1">
            R$ {receitaHoje.toFixed(0)}
          </Text>
          <Text className="text-[#988C81] text-sm mt-1">estimado</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-bold">Agenda de Hoje</Text>
      </View>

      {loading && (
        <View className="items-center justify-center py-8">
          <Text className="text-[#988C81]">Carregando...</Text>
        </View>
      )}

      {!loading && agendamentosDeHoje.length === 0 && (
        <View className="items-center justify-center py-8">
          <Text className="text-[#988C81]">Nenhum agendamento para hoje</Text>
        </View>
      )}

      <View className="gap-3 mb-6">
        {agendamentosDeHoje.map((a) => (
          <AppointmentRow key={a.id} a={a} />
        ))}
      </View>

      <GoldButton title="Agendamento Manual" onPress={onNew} />
    </ScrollView>
  );
}

function AppointmentRow({ a }: { a: Agendamento }) {
  const cancelled = a.status === "CANCELADO";
  const proximo = a.status === "PENDENTE";

  const horaFormatada = (() => {
    const d = new Date(a.dataHora);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  })();

  const statusLabel = a.status === "PENDENTE" ? "Próximo" : a.status === "CONCLUIDO" ? "Concluído" : "Cancelado";

  return (
    <View className={`bg-[#1B1B1B] border border-[#ffffff25] rounded-2xl p-4 flex-row items-center ${cancelled ? "opacity-60" : ""}`}>
      <View className="w-14">
        <Text className={`text-lg font-bold ${proximo ? "text-[#CC8F33]" : "text-[#988C81]"} ${cancelled ? "line-through" : ""}`}>
          {horaFormatada}
        </Text>
        <Text className="text-textmuted text-[#988C81] text-xs mt-1">{a.servico.duracaoMin} min</Text>
      </View>
      <View className={`w-[.5px] h-12 mx-3 ${proximo ? "bg-[#CC8F33]" : "bg-[#988C81]"} ${cancelled ? "bg-[#DC2828]" : ""}`} />
      <View className="w-10 h-10 rounded-full bg-[#292623] items-center justify-center mr-3">
        <Text className={`text-base ${proximo ? "text-[#CC8F33]" : "text-[#988C81]"} ${cancelled ? "text-[#DC2828]" : ""}`}>
          {a.usuario.nome.substring(0, 1)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white text-base font-semibold">{a.usuario.nome}</Text>
        <Text className="text-[#988C81] text-xs mt-0.5">{a.servico.nome}</Text>
      </View>
      <StatusBadge label={statusLabel} />
    </View>
  );
}