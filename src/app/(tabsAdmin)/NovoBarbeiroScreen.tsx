import { useState } from "react";
import { KeyboardTypeOptions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const ROLES = ["BARBEIRO", "APRENDIZ", "GERENTE"];
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function NovoBarbeiroScreen({ onBack }: { onBack: () => void }) {
  const { usuario } = useAuth();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [anosExp, setAnosExp] = useState("");
  const [role, setRole] = useState("BARBEIRO");
  const [loading, setLoading] = useState(false);
    
  const handleCadastrar = async () => {
    if (!nome.trim()) {
      Toast.show({ type: "error", text1: "Nome é obrigatório" });
      return;
    }
    if (!email.trim()) {
      Toast.show({ type: "error", text1: "E-mail é obrigatório" });
      return;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, "").length !== 11) {
      Toast.show({ type: "error", text1: "Telefone deve conter 11 dígitos" });
      return;
    }
    if (!anosExp.trim() || isNaN(Number(anosExp))) {
      Toast.show({ type: "error", text1: "Anos de experiência deve ser um número" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/barbeiros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario?.token}`,
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone.replace(/\D/g, ""),
          anosExp: parseInt(anosExp),
          funcao: role,
          barbeariaId: usuario?.barbeariaId,
          ativo: true,
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
        text2: `Barbeiro ${nome} cadastrado com sucesso`,
      });

      setNome("");
      setEmail("");
      setTelefone("");
      setAnosExp("");
      setRole("BARBEIRO");

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
      <ScreenHeader title="Novo Barbeiro" onBack={onBack} />
      <Text className="text-[#988C81] text-xs tracking-widest mb-4">CADASTRO DA EQUIPE</Text>

      <Field label="Nome completo" placeholder="Ex: Carlos Silva" value={nome} onChangeText={setNome} />
      <Field label="Telefone" placeholder="(11) 91234-5678" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
      <Field label="E-mail" placeholder="email@barbearia.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field label="Anos de experiência" placeholder="Ex: 5" keyboardType="numeric" value={anosExp} onChangeText={setAnosExp} />

      <Text className="text-[#988C81] text-sm mb-2">Função</Text>
      <View className="flex-row gap-3 mb-5">
        {ROLES.map((r) => {
          const active = r === role;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              className={`flex-1 py-3 rounded-2xl border items-center ${active ? "border-[#CC8F33] bg-[#CC8F3320]" : "border-[#3A3A3A] bg-[#1B1B1B]"}`}
            >
              <Text className={active ? "text-[#CC8F33] font-semibold" : "text-[#988C81]"}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="h-2" />
      <GoldButton title={loading ? "Cadastrando..." : "Cadastrar Barbeiro"} onPress={handleCadastrar} disabled={loading} />
    </ScrollView>
  );
}

function Field({ label, placeholder, keyboardType, value, onChangeText }: { label: string; placeholder: string; keyboardType?: KeyboardTypeOptions; value: string; onChangeText: (text: string) => void }) {
  return (
    <View className="mb-4">
      <Text className="text-[#988C81] text-sm mb-2">{label}</Text>
      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4">
        <TextInput placeholder={placeholder} placeholderTextColor="#988C81" className="text-white" keyboardType={keyboardType} value={value} onChangeText={onChangeText} />
      </View>
    </View>
  );
}