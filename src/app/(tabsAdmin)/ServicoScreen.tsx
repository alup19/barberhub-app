import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import ScreenHeader from "../../components/ScreenHeader";
import StatusBadge from "../../components/StatusBadge";
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

const CATEGORIAS_LABEL: Record<string, string> = {
  TODOS: "Todos",
  CABELO: "Cabelo",
  BARBA: "Barba",
  SOBRANCELHA: "Sobrancelha",
  TRATAMENTO: "Tratamento",
  ESTETICA: "Estética",
  PREMIUM: "Premium",
};

const ICONE_CATEGORIA: Record<string, keyof typeof Ionicons.glyphMap> = {
  CABELO: "cut-outline",
  BARBA: "man-outline",
  SOBRANCELHA: "eye-outline",
  TRATAMENTO: "leaf-outline",
  ESTETICA: "sparkles-outline",
  PREMIUM: "star-outline",
};

const categories = ["Todos", "Cabelo", "Barba", "Sobrancelha", "Tratamento", "Estética", "Premium"];

type ConfirmState = { tipo: "toggle" | "excluir"; servico: Servico } | null;

export default function ServicosScreen({ onNew }: { onNew: () => void }) {
  const { fetchComAuth, usuario } = useAuth();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("Todos");
  const [menuAberto, setMenuAberto] = useState<Servico | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

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
      setServicos(data);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar serviços", text2: error.message || "Tente novamente" });
    } finally {
      setLoading(false);
    }
  };

  const executarToggle = async () => {
    if (!confirm || confirm.tipo !== "toggle") return;
    const servico = confirm.servico;
    setConfirm(null);
    setMenuAberto(null);
    try {
      const response = await fetchComAuth(`${apiUrl}/servicos/${servico.id}`, {
        method: "PUT",
        body: JSON.stringify({ ativo: !servico.ativo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao atualizar");
      Toast.show({
        type: "success",
        text1: servico.ativo ? "Serviço desativado" : "Serviço ativado",
      });
      carregarServicos();
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro", text2: error.message || "Tente novamente" });
    }
  };

  const executarExclusao = async () => {
    if (!confirm || confirm.tipo !== "excluir") return;
    const servico = confirm.servico;
    setConfirm(null);
    setMenuAberto(null);
    try {
      const response = await fetchComAuth(`${apiUrl}/servicos/${servico.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.erro || "Erro ao excluir");
      }
      Toast.show({ type: "success", text1: "Serviço excluído" });
      carregarServicos();
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao excluir", text2: error.message || "Tente novamente" });
    }
  };

  const servicosFiltrados = servicos.filter((s) => {
    if (cat === "Todos") return true;
    const catKey = Object.entries(CATEGORIAS_LABEL).find(([, v]) => v === cat)?.[0];
    return s.categoria === catKey;
  });

  const ativos = servicos.filter((s) => s.ativo).length;

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader
          title="Serviços"
          subtitle={`${ativos} serviço${ativos !== 1 ? "s" : ""} ativo${ativos !== 1 ? "s" : ""}`}
          right={
            <TouchableOpacity onPress={onNew} className="bg-[#CC8F33] flex-row items-center px-4 py-2.5 rounded-xl">
              <Ionicons name="add" size={18} color="#000" />
              <Text className="text-black font-bold ml-1">Novo</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          <View className="flex-row gap-2">
            {categories.map((c) => {
              const active = c === cat;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCat(c)}
                  className={`px-4 py-2.5 rounded-full border ${active ? "bg-[#CC8F33] border-[#CC8F33]" : "bg-[#1B1B1B] border-[#3A3A3A]"}`}
                >
                  <Text className={active ? "text-black font-bold" : "text-[#988C81]"}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {loading && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Carregando...</Text>
          </View>
        )}

        {!loading && servicosFiltrados.length === 0 && (
          <View className="items-center justify-center py-8">
            <Text className="text-[#988C81]">Nenhum serviço encontrado</Text>
          </View>
        )}

        <View className="gap-3">
          {servicosFiltrados.map((s) => {
            const inactive = !s.ativo;
            const isPremium = s.categoria === "PREMIUM";
            return (
              <View
                key={s.id}
                style={{
                  backgroundColor: inactive ? "#111111" : "#1B1B1B",
                  borderColor: isPremium ? "#CC8F3380" : inactive ? "#252525" : "#3A3A3A",
                  opacity: inactive ? 0.55 : 1,
                }}
                className="border rounded-2xl p-4 flex-row items-center"
              >
                <View className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${isPremium ? "bg-[#CC8F3320]" : "bg-[#252525]"}`}>
                  <Ionicons
                    name={ICONE_CATEGORIA[s.categoria] ?? "cut-outline"}
                    size={20}
                    color={isPremium ? "#D4A24C" : inactive ? "#555" : "#9A9AA5"}
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text style={{ fontWeight: "bold", color: inactive ? "#666" : "#FFFFFF" }}>{s.nome}</Text>
                    {isPremium && <StatusBadge label="PREMIUM" />}
                  </View>
                  <Text className="text-[#988C81] text-xs mt-0.5">
                    {s.duracaoMin} min
                    {inactive && <Text style={{ color: "#CC8F33" }}> · Inativo</Text>}
                  </Text>
                </View>

                <View className="items-end gap-1">
                  <Text style={{ fontWeight: "bold", fontSize: 18, color: inactive ? "#555" : "#CC8F33" }}>
                    R$ {s.preco.toFixed(2).replace(".", ",")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMenuAberto(s)}
                    className="w-7 h-7 rounded-md bg-[#252525] border border-[#3A3A3A] items-center justify-center"
                  >
                    <Ionicons name="ellipsis-vertical" size={13} color={inactive ? "#555" : "#D4A24C"} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom sheet menu */}
      <Modal visible={!!menuAberto && !confirm} transparent animationType="slide" onRequestClose={() => setMenuAberto(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }} onPress={() => setMenuAberto(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: "#1B1B1B", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>

              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A3A3A", alignSelf: "center", marginBottom: 20 }} />

              <View className="flex-row items-center mb-6">
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${menuAberto?.categoria === "PREMIUM" ? "bg-[#CC8F3320]" : "bg-[#252525]"}`}>
                  <Ionicons
                    name={ICONE_CATEGORIA[menuAberto?.categoria ?? "CABELO"] ?? "cut-outline"}
                    size={18}
                    color={menuAberto?.categoria === "PREMIUM" ? "#D4A24C" : "#9A9AA5"}
                  />
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{menuAberto?.nome}</Text>
                  <Text className="text-[#988C81] text-xs">
                    {CATEGORIAS_LABEL[menuAberto?.categoria ?? ""] ?? menuAberto?.categoria} · R$ {menuAberto?.preco.toFixed(2).replace(".", ",")}
                    {!menuAberto?.ativo && <Text style={{ color: "#CC8F33" }}> · Inativo</Text>}
                  </Text>
                </View>
              </View>

              {/* Toggle ativo/inativo */}
              <TouchableOpacity
                onPress={() => menuAberto && setConfirm({ tipo: "toggle", servico: menuAberto })}
                className="flex-row items-center gap-3 py-4 border-b border-[#2A2A2A]"
              >
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#CC8F3320" }}>
                  <Ionicons name={menuAberto?.ativo ? "pause-circle-outline" : "play-circle-outline"} size={18} color="#CC8F33" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium">
                    {menuAberto?.ativo ? "Desativar serviço" : "Ativar serviço"}
                  </Text>
                  <Text className="text-[#988C81] text-xs mt-0.5">
                    {menuAberto?.ativo ? "Serviço não aparecerá para agendamento" : "Serviço voltará a aparecer para agendamento"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Excluir */}
              <TouchableOpacity
                onPress={() => menuAberto && setConfirm({ tipo: "excluir", servico: menuAberto })}
                className="flex-row items-center gap-3 py-4"
              >
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#DC28281A" }}>
                  <Ionicons name="trash-outline" size={18} color="#DC2828" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: "#DC2828", fontSize: 14, fontWeight: "500" }}>Excluir serviço</Text>
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

      {/* Bottom sheet confirmação */}
      <Modal visible={!!confirm} transparent animationType="slide" onRequestClose={() => setConfirm(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }} onPress={() => setConfirm(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: "#1B1B1B", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>

              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#3A3A3A", alignSelf: "center", marginBottom: 20 }} />

              {confirm?.tipo === "toggle" && (
                <>
                  <Text className="text-white font-bold text-base mb-2">
                    {confirm.servico.ativo ? "Desativar serviço" : "Ativar serviço"}
                  </Text>
                  <Text className="text-[#988C81] text-sm mb-6">
                    {confirm.servico.ativo
                      ? `"${confirm.servico.nome}" ficará invisível para novos agendamentos.`
                      : `"${confirm.servico.nome}" voltará a aparecer para agendamento.`}
                  </Text>
                  <TouchableOpacity
                    onPress={executarToggle}
                    className="items-center py-3.5 rounded-xl mb-3"
                    style={{ backgroundColor: "#CC8F33" }}
                  >
                    <Text style={{ color: "#000", fontWeight: "bold", fontSize: 14 }}>
                      {confirm.servico.ativo ? "Confirmar desativação" : "Confirmar ativação"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {confirm?.tipo === "excluir" && (
                <>
                  <Text className="text-white font-bold text-base mb-2">Excluir "{confirm.servico.nome}"?</Text>
                  <Text className="text-[#988C81] text-sm mb-6">
                    Essa ação é permanente e não pode ser desfeita. O serviço será removido da barbearia.
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