import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../../components/ScreenHeader";

export default function ConfigScreen() {
  const [novos, setNovos] = useState(true);
  const [lembretes, setLembretes] = useState(true);
  const [cancel, setCancel] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Configurações" subtitle="Barbearia & preferências" />

      <View className="bg-surface border border-border rounded-2xl p-4 flex-row items-center mb-6">
        <View className="w-14 h-14 rounded-full bg-goldDark items-center justify-center mr-3">
          <Ionicons name="sad-outline" size={26} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">Barbearia Nome</Text>
          <Text className="text-textmuted text-xs">Carlos Mendes · Proprietário</Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 rounded-full bg-success mr-1.5" />
            <Text className="text-success text-xs">Aberto agora</Text>
          </View>
        </View>
        <TouchableOpacity className="w-9 h-9 rounded-lg bg-surface2 border border-border items-center justify-center">
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
        <Row icon="log-out-outline" title="Sair da Conta" danger />
      </Section>
    </ScrollView>
  );
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View className="mb-6">
    <Text className="text-textmuted text-xs tracking-widest mb-3">{title}</Text>
    <View className="bg-surface border border-border rounded-2xl overflow-hidden">{children}</View>
  </View>
);

const Row = ({ icon, title, sub, right, danger }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub?: string; right?: ReactNode; danger?: boolean }) => (
  <TouchableOpacity className="flex-row items-center px-4 py-3.5 border-b border-border" activeOpacity={0.7}>
    <View className="w-9 h-9 rounded-lg bg-surface2 items-center justify-center mr-3">
      <Ionicons name={icon} size={18} color={danger ? "#E5484D" : "#D4A24C"} />
    </View>
    <View className="flex-1">
      <Text className={`font-semibold ${danger ? "text-danger" : "text-white"}`}>{title}</Text>
      {sub && <Text className="text-textmuted text-xs mt-0.5">{sub}</Text>}
    </View>
    {right || (!danger && <Ionicons name="chevron-forward" size={18} color="#9A9AA5" />)}
  </TouchableOpacity>
);
