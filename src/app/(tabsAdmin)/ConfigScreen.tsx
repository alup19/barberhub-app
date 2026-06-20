import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ReactNode, useCallback, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Barbearia = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  descricao: string | null;
  horarioOpen: string; // ISO
  horarioClose: string; // ISO
  totalBarbeiros: number;
  totalServicos: number;
  totalAgendamentos: number;
};

function horaFormatada(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0") !== "00" ? String(d.getMinutes()).padStart(2, "0") : ""}`;
}

function estaAberta(horarioOpen: string, horarioClose: string): boolean {
  const agora = new Date();
  const abre = new Date(horarioOpen);
  const fecha = new Date(horarioClose);

  const minAgora = agora.getHours() * 60 + agora.getMinutes();
  const minAbre = abre.getHours() * 60 + abre.getMinutes();
  const minFecha = fecha.getHours() * 60 + fecha.getMinutes();

  return minAgora >= minAbre && minAgora < minFecha;
}

export default function ConfigScreen() {
  const { usuario, logout, fetchComAuth } = useAuth();

  const [barbearia, setBarbearia] = useState<Barbearia | null>(null);
  const [loading, setLoading] = useState(false);

  // Preferências locais (não existem no backend ainda)
  const [novos, setNovos] = useState(true);
  const [lembretes, setLembretes] = useState(true);
  const [cancel, setCancel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarBarbearia();
    }, [])
  );

  const carregarBarbearia = async () => {
    setLoading(true);
    try {
      const response = await fetchComAuth(`${apiUrl}/barbearias/${usuario?.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao buscar barbearia");

      if (data.length > 0) setBarbearia(data[0]);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar barbearia", text2: error.message || "Tente novamente" });
    } finally {
      setLoading(false);
    }
  };

  const aberta = barbearia ? estaAberta(barbearia.horarioOpen, barbearia.horarioClose) : false;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Configurações" subtitle="Barbearia & preferências" />

      {loading && (
        <View className="items-center justify-center py-8">
          <Text className="text-[#988C81]">Carregando...</Text>
        </View>
      )}

      {!loading && barbearia && (
        <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl p-4 flex-row items-center mb-6">
          <View className="w-14 h-14 rounded-full bg-[#CC8F3320] items-center justify-center mr-3">
            <Ionicons name="cut-outline" size={26} color="#D4A24C" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">{barbearia.nome}</Text>
            <Text className="text-[#988C81] text-xs">{usuario?.nome} · Proprietário</Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-2 h-2 rounded-full mr-1.5 ${aberta ? "bg-[#22C55E]" : "bg-[#E5484D]"}`} />
              <Text className={`text-xs ${aberta ? "text-[#22C55E]" : "text-[#E5484D]"}`}>
                {aberta ? "Aberto agora" : "Fechado agora"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/admin/editar-barbearia")}
            className="w-9 h-9 rounded-lg bg-[#252525] border border-[#3A3A3A] items-center justify-center"
          >
            <Ionicons name="create-outline" size={16} color="#D4A24C" />
          </TouchableOpacity>
        </View>
      )}

      {!loading && barbearia && (
        <Section title="INFORMAÇÕES">
          <Row icon="location-outline" title="Endereço" sub={barbearia.endereco} />
          <Row
            icon="hourglass-outline"
            title="Horário de Funcionamento"
            sub={`Abre ${horaFormatada(barbearia.horarioOpen)} · Fecha ${horaFormatada(barbearia.horarioClose)}`}
          />
          <Row icon="call-outline" title="Telefone" sub={barbearia.telefone} />
        </Section>
      )}

      {!loading && barbearia && (
        <Section title="RESUMO">
          <Row icon="people-outline" title="Barbeiros cadastrados" sub={String(barbearia.totalBarbeiros)} />
          <Row icon="cut-outline" title="Serviços cadastrados" sub={String(barbearia.totalServicos)} />
          <Row icon="calendar-outline" title="Total de agendamentos" sub={String(barbearia.totalAgendamentos)} />
        </Section>
      )}

      <Section title="NOTIFICAÇÕES">
        <Row icon="notifications-outline" title="Novos agendamentos" sub="Push + SMS"
          right={<Switch value={novos} onValueChange={setNovos} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
        <Row icon="time-outline" title="Lembretes" sub="30 min antes"
          right={<Switch value={lembretes} onValueChange={setLembretes} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
        <Row icon="close-outline" title="Cancelamentos" sub="Aviso imediato"
          right={<Switch value={cancel} onValueChange={setCancel} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
      </Section>

      <Section title="CONTA">
        <Row icon="person-outline" title="Alterar Perfil" />
        <Row icon="lock-closed-outline" title="Segurança" />
        <Row onPress={async () => {
          await logout();
          router.replace("/login");
        }} icon="log-out-outline" title="Sair da Conta" danger />
      </Section>
    </ScrollView>
  );
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View className="mb-6">
    <Text className="text-[#988C81] text-xs tracking-widest mb-3">{title}</Text>
    <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl overflow-hidden">{children}</View>
  </View>
);

const Row = ({ icon, title, sub, right, danger, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub?: string; right?: ReactNode; danger?: boolean; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center px-4 py-3.5 border-b border-[#3A3A3A]" activeOpacity={0.7}>
    <View className="w-9 h-9 rounded-lg bg-[#252525] items-center justify-center mr-3">
      <Ionicons name={icon} size={18} color={danger ? "#E5484D" : "#D4A24C"} />
    </View>
    <View className="flex-1">
      <Text className={`font-semibold ${danger ? "text-[#E5484D]" : "text-white"}`}>{title}</Text>
      {sub && <Text className="text-[#988C81] text-xs mt-0.5">{sub}</Text>}
    </View>
    {right || (!danger && <Ionicons name="chevron-forward" size={18} color="#9A9AA5" />)}
  </TouchableOpacity>
);