import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Barbeiro = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  anosExp: number;
  funcao: string;
  ativo: boolean;
  totalAgendamentos: number;
  agendamentosConluidos: number;
};

type ConfirmState = { tipo: "folga" | "excluir"; barbeiro: Barbeiro } | null;

export default function EquipeScreen({ onNew }: { onNew: () => void }) {
  const { usuario } = useAuth();
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandidos, setExpandidos] = useState<Record<number, boolean>>({});
  const [menuAberto, setMenuAberto] = useState<Barbeiro | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  useFocusEffect(
    useCallback(() => {
      carregarBarbeiros();
    }, [])
  );

  const toggleExpandido = (id: number) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const carregarBarbeiros = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/barbeiros/barbearia/${usuario?.barbeariaId}`, {
        headers: { Authorization: `Bearer ${usuario?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao buscar barbeiros");
      setBarbeiros(data);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar barbeiros", text2: error.message || "Tente novamente" });
    } finally {
      setLoading(false);
    }
  };

  const executarFolga = async () => {
    if (!confirm || confirm.tipo !== "folga") return;
    const barbeiro = confirm.barbeiro;
    setConfirm(null);
    setMenuAberto(null);
    try {
      const response = await fetch(`${apiUrl}/barbeiros/${barbeiro.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${usuario?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !barbeiro.ativo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao atualizar");
      Toast.show({ type: "success", text1: barbeiro.ativo ? "Folga registrada" : "Barbeiro reativado" });
      carregarBarbeiros();
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro", text2: error.message || "Tente novamente" });
    }
  };

  const executarExclusao = async () => {
    if (!confirm || confirm.tipo !== "excluir") return;
    const barbeiro = confirm.barbeiro;
    setConfirm(null);
    setMenuAberto(null);
    try {
      const response = await fetch(`${apiUrl}/barbeiros/${barbeiro.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${usuario?.token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.erro || "Erro ao excluir");
      }
      Toast.show({ type: "success", text1: "Barbeiro excluído" });
      carregarBarbeiros();
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao excluir", text2: error.message || "Tente novamente" });
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader
          title="Equipe"
          subtitle={`${barbeiros.length} barbeiro${barbeiros.length !== 1 ? "s" : ""} ativo${barbeiros.length !== 1 ? "s" : ""}`}
          right={
            <TouchableOpacity onPress={onNew} className="bg-[#CC8F33] flex-row items-center px-4 py-2.5 rounded-xl">
              <Ionicons name="add" size={18} color="#000" />
              <Text className="text-black font-bold ml-1">Novo</Text>
            </TouchableOpacity>
          }
        />

        {loading && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Carregando...</Text>
          </View>
        )}

        {!loading && barbeiros.length === 0 && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Nenhum barbeiro cadastrado</Text>
          </View>
        )}

        <View className="gap-4">
          {barbeiros.map((m) => {
            const aberto = !!expandidos[m.id];
            return (
              <View
                key={m.id}
                className="border rounded-2xl p-4"
                style={{
                  backgroundColor: m.ativo ? "#1B1B1B" : "#111111",
                  borderColor: m.ativo ? "#3A3A3A" : "#252525",
                  opacity: m.ativo ? 1 : 0.55,
                }}
              >
                <View className="flex-row items-center mb-4">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-3 relative"
                    style={{ backgroundColor: m.ativo ? "#292623" : "#1A1A1A" }}
                  >
                    <Text style={{ color: m.ativo ? "#C5C1B9" : "#555", fontWeight: "bold" }}>
                      {m.nome.substring(0, 1)}
                    </Text>
                    <View
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{
                        backgroundColor: m.ativo ? "#22C55E" : "#3A3A3A",
                        borderColor: m.ativo ? "#292623" : "#1A1A1A",
                      }}
                    />
                  </View>

                  <View className="flex-1">
                    <Text style={{ color: m.ativo ? "#FFFFFF" : "#666", fontWeight: "bold", fontSize: 15 }}>
                      {m.nome}
                    </Text>
                    <Text style={{ color: m.ativo ? "#988C81" : "#555", fontSize: 12, marginTop: 2 }}>
                      {m.funcao} · {m.anosExp} ano{m.anosExp !== 1 ? "s" : ""} de experiência
                      {!m.ativo && <Text style={{ color: "#CC8F33" }}> · De folga</Text>}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setMenuAberto(m)}
                    className="w-9 h-9 items-center justify-center rounded-lg border border-[#3A3A3A]"
                    style={{ backgroundColor: "#FFFFFF0D" }}
                  >
                    <Ionicons name="ellipsis-vertical" size={17} color="#988C81" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-2 mb-3">
                  <Stat value={String(m.totalAgendamentos)} valueColor={m.ativo ? "#CC8F33" : "#555"} sub="agendamentos" inactive={!m.ativo} />
                  <Stat value={String(m.agendamentosConluidos)} sub="concluídos" inactive={!m.ativo} />
                </View>

                <TouchableOpacity
                  onPress={() => toggleExpandido(m.id)}
                  className="flex-row items-center justify-between border rounded-xl px-3 py-2.5"
                  style={{ borderColor: m.ativo ? "#3A3A3A" : "#252525" }}
                >
                  <Text style={{ color: m.ativo ? "#988C81" : "#555", fontSize: 12 }}>Contato</Text>
                  <Ionicons name={aberto ? "chevron-up" : "chevron-down"} size={16} color={m.ativo ? "#988C81" : "#555"} />
                </TouchableOpacity>

                {aberto && (
                  <View className="gap-2 mt-2">
                    <View className="border border-[#2A2A2A] rounded-xl px-3 py-2.5" style={{ backgroundColor: "#0E0E0E" }}>
                      <Text className="text-[#988C81] text-xs mb-0.5">Email</Text>
                      <Text className="text-white text-sm">{m.email}</Text>
                    </View>
                    <View className="border border-[#2A2A2A] rounded-xl px-3 py-2.5" style={{ backgroundColor: "#0E0E0E" }}>
                      <Text className="text-[#988C81] text-xs mb-0.5">Telefone</Text>
                      <Text className="text-white text-sm">{m.telefone}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom sheet principal */}
      <Modal visible={!!menuAberto && !confirm} transparent animationType="slide" onRequestClose={() => setMenuAberto(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }} onPress={() => setMenuAberto(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: "#1B1B1B", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>

              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A3A3A", alignSelf: "center", marginBottom: 20 }} />

              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: menuAberto?.ativo ? "#292623" : "#1A1A1A" }}>
                  <Text style={{ color: menuAberto?.ativo ? "#C5C1B9" : "#555", fontWeight: "bold" }}>
                    {menuAberto?.nome.substring(0, 1)}
                  </Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{menuAberto?.nome}</Text>
                  <Text className="text-[#988C81] text-xs">
                    {menuAberto?.funcao}
                    {!menuAberto?.ativo && <Text style={{ color: "#CC8F33" }}> · De folga</Text>}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => menuAberto && setConfirm({ tipo: "folga", barbeiro: menuAberto })}
                className="flex-row items-center gap-3 py-4 border-b border-[#2A2A2A]"
              >
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#CC8F3320" }}>
                  <Ionicons name={menuAberto?.ativo ? "moon-outline" : "sunny-outline"} size={18} color="#CC8F33" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium">
                    {menuAberto?.ativo ? "Dar folga" : "Retomar atividade"}
                  </Text>
                  <Text className="text-[#988C81] text-xs mt-0.5">
                    {menuAberto?.ativo ? "Barbeiro ficará inativo temporariamente" : "Barbeiro voltará a receber agendamentos"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => menuAberto && setConfirm({ tipo: "excluir", barbeiro: menuAberto })}
                className="flex-row items-center gap-3 py-4"
              >
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#DC28281A" }}>
                  <Ionicons name="trash-outline" size={18} color="#DC2828" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: "#DC2828", fontSize: 14, fontWeight: "500" }}>Excluir barbeiro</Text>
                  <Text className="text-[#988C81] text-xs mt-0.5">Essa ação não pode ser desfeita</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMenuAberto(null)} className="mt-4 items-center py-3 border border-[#3A3A3A] rounded-xl">
                <Text className="text-[#988C81] text-sm">Cancelar</Text>
              </TouchableOpacity>

            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bottom sheet de confirmação */}
      <Modal visible={!!confirm} transparent animationType="slide" onRequestClose={() => setConfirm(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }} onPress={() => setConfirm(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: "#1B1B1B", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>

              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A3A3A", alignSelf: "center", marginBottom: 20 }} />

              {confirm?.tipo === "folga" && (
                <>
                  <Text className="text-white font-bold text-base mb-2">
                    {confirm.barbeiro.ativo ? "Dar folga" : "Retomar atividade"}
                  </Text>
                  <Text className="text-[#988C81] text-sm mb-6">
                    {confirm.barbeiro.ativo
                      ? `${confirm.barbeiro.nome} ficará inativo e não receberá novos agendamentos.`
                      : `${confirm.barbeiro.nome} voltará a receber agendamentos normalmente.`}
                  </Text>
                  <TouchableOpacity
                    onPress={executarFolga}
                    className="items-center py-3.5 rounded-xl mb-3"
                    style={{ backgroundColor: "#CC8F33" }}
                  >
                    <Text style={{ color: "#000", fontWeight: "bold", fontSize: 14 }}>
                      {confirm.barbeiro.ativo ? "Confirmar folga" : "Confirmar retorno"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {confirm?.tipo === "excluir" && (
                <>
                  <Text className="text-white font-bold text-base mb-2">Excluir {confirm.barbeiro.nome}?</Text>
                  <Text className="text-[#988C81] text-sm mb-6">
                    Essa ação é permanente e não pode ser desfeita. Todos os dados do barbeiro serão removidos.
                  </Text>
                  <TouchableOpacity
                    onPress={executarExclusao}
                    className="items-center py-3.5 rounded-xl mb-3"
                    style={{ backgroundColor: "#DC2828" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>Excluir permanentemente</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity onPress={() => setConfirm(null)} className="items-center py-3 border border-[#3A3A3A] rounded-xl">
                <Text className="text-[#988C81] text-sm">Cancelar</Text>
              </TouchableOpacity>

            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const Stat = ({
  value,
  sub,
  valueColor = "#FFFFFF",
  inactive = false,
}: {
  value: string;
  sub: string;
  valueColor?: string;
  inactive?: boolean;
}) => (
  <View className="flex-1 rounded-xl py-3 items-center" style={{ backgroundColor: inactive ? "#0A0A0A" : "#110F0E" }}>
    <Text style={{ fontWeight: "bold", fontSize: 18, color: inactive ? "#555" : valueColor }}>{value}</Text>
    <Text style={{ color: inactive ? "#444" : "#988C81", fontSize: 11, marginTop: 2 }}>{sub}</Text>
  </View>
);
