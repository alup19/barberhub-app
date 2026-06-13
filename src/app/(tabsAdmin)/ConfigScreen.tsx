import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

export default function ConfigScreen() {
  const { logout } = useAuth();
  const [novos, setNovos] = useState(true);
  const [lembretes, setLembretes] = useState(true);
  const [cancel, setCancel] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Configurações" subtitle="Barbearia & preferências" />

      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl p-4 flex-row items-center mb-6">
        <View className="w-14 h-14 rounded-full bg-[#CC8F3320] items-center justify-center mr-3">
          <Ionicons name="sad-outline" size={26} color="#D4A24C" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">Barbearia Nome</Text>
          <Text className="text-[#988C81] text-xs">Carlos Mendes · Proprietário</Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 rounded-full bg-[#22C55E] mr-1.5" />
            <Text className="text-[#22C55E] text-xs">Aberto agora</Text>
          </View>
        </View>
        <TouchableOpacity className="w-9 h-9 rounded-lg bg-[#252525] border border-[#3A3A3A] items-center justify-center">
          <Ionicons name="create-outline" size={16} color="#D4A24C" />
        </TouchableOpacity>
      </View>

      <Section title="INFORMAÇÕES">
        <Row icon="location-outline" title="Endereço" sub="Rua das Palmeiras, 123 – São Paulo" />
        <Row icon="hourglass-outline" title="Horário de Funcionamento" sub="Seg–Sáb: 9h–19h · Dom: Fechado" />
        <Row icon="call-outline" title="Telefone" sub="(11) 98765-4321" />
      </Section>

      <Section title="NOTIFICAÇÕES">
        <Row icon="notifications-outline" title="Novos agendamentos" sub="Push + SMS"
          right={<Switch value={novos} onValueChange={setNovos} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
        <Row icon="time-outline" title="Lembretes" sub="30 min antes"
          right={<Switch value={lembretes} onValueChange={setLembretes} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
        <Row icon="close-outline" title="Cancelamentos" sub="Aviso imediato"
          right={<Switch value={cancel} onValueChange={setCancel} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />} />
      </Section>

      <Section title="PAGAMENTOS">
        <Row icon="card-outline" title="Métodos Aceitos" sub="PIX, Cartão, Dinheiro" />
        <Row icon="logo-bitcoin" title="Chave PIX" sub="barbearia.elite@pix.com" />
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