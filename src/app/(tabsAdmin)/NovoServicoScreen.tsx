import { useState } from "react";
import { KeyboardTypeOptions, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const CATEGORIAS: { label: string; value: string }[] = [
  { label: "Cabelo", value: "CABELO" },
  { label: "Barba", value: "BARBA" },
  { label: "Sobrancelha", value: "SOBRANCELHA" },
  { label: "Tratamento", value: "TRATAMENTO" },
  { label: "Estética", value: "ESTETICA" },
  { label: "Premium", value: "PREMIUM" },
];

export default function NovoServicoScreen({ onBack }: { onBack: () => void }) {
  const { usuario } = useAuth();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [duracaoMin, setDuracaoMin] = useState("");
  const [categoria, setCategoria] = useState("CABELO");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim() || nome.trim().length < 2) {
      Toast.show({ type: "error", text1: "Nome deve ter pelo menos 2 caracteres" });
      return;
    }
    if (!preco.trim() || isNaN(Number(preco)) || Number(preco) <= 0) {
      Toast.show({ type: "error", text1: "Preço deve ser um valor positivo" });
      return;
    }
    if (!duracaoMin.trim() || isNaN(Number(duracaoMin)) || Number(duracaoMin) <= 0) {
      Toast.show({ type: "error", text1: "Duração deve ser um número positivo" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/servicos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario?.token}`,
        },
        body: JSON.stringify({
          nome: nome.trim(),
          descricao: descricao.trim() || null,
          preco: parseFloat(preco),
          duracaoMin: parseInt(duracaoMin),
          categoria,
          ativo,
          barbeariaId: usuario?.barbeariaId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = typeof data.erro === "string" ? data.erro : JSON.stringify(data.erro);
        throw new Error(errorMsg);
      }

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: `Serviço "${nome}" cadastrado com sucesso`,
      });

      setNome("");
      setDescricao("");
      setPreco("");
      setDuracaoMin("");
      setCategoria("CABELO");
      setAtivo(true);

      setTimeout(onBack, 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: error.message || "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Novo Serviço" onBack={onBack} />
      <Text className="text-[#988C81] text-xs tracking-widest mb-4">CADASTRO DE SERVIÇO</Text>

      <Field label="Nome do serviço" placeholder="Ex: Corte + Barba" value={nome} onChangeText={setNome} />
      <Field label="Descrição" placeholder="Detalhes do serviço..." value={descricao} onChangeText={setDescricao} multiline />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Field label="Preço (R$)" placeholder="55" keyboardType="numeric" value={preco} onChangeText={setPreco} />
        </View>
        <View className="flex-1">
          <Field label="Duração (min)" placeholder="45" keyboardType="numeric" value={duracaoMin} onChangeText={setDuracaoMin} />
        </View>
      </View>

      <Text className="text-[#988C81] text-sm mb-2">Categoria</Text>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {CATEGORIAS.map((c) => {
          const active = c.value === categoria;
          return (
            <TouchableOpacity
              key={c.value}
              onPress={() => setCategoria(c.value)}
              className={`px-4 py-2.5 rounded-xl border ${active ? "border-[#CC8F33] bg-[#CC8F3320]" : "border-[#3A3A3A] bg-[#1B1B1B]"}`}
            >
              <Text className={active ? "text-[#CC8F33] font-semibold" : "text-[#988C81]"}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4 flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-white font-semibold">Serviço ativo</Text>
          <Text className="text-[#988C81] text-xs mt-0.5">Aparece para agendamento</Text>
        </View>
        <Switch
          value={ativo}
          onValueChange={setAtivo}
          trackColor={{ true: "#D4A24C", false: "#26262F" }}
          thumbColor="#fff"
        />
      </View>

      <GoldButton
        title={loading ? "Cadastrando..." : "Cadastrar Serviço"}
        onPress={handleCadastrar}
        disabled={loading}
      />
    </ScrollView>
  );
}

function Field({
  label,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  multiline,
}: {
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="text-[#988C81] text-sm mb-2">{label}</Text>
      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#988C81"
          className="text-white"
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
      </View>
    </View>
  );
}