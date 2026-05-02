import { useState } from "react";
import { KeyboardTypeOptions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";

const ROLES = ["Barbeiro", "Aprendiz", "Gerente"];

export default function NovoBarbeiroScreen({ onBack }: { onBack: () => void }) {
  const [role, setRole] = useState("Barbeiro");
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Novo Barbeiro" onBack={onBack} />
      <Text className="text-textmuted text-xs tracking-widest mb-4">CADASTRO DA EQUIPE</Text>

      <Field label="Nome completo" placeholder="Ex: Carlos Silva" />
      <Field label="Telefone" placeholder="(11) 91234-5678" keyboardType="phone-pad" />
      <Field label="E-mail" placeholder="email@barbearia.com" keyboardType="email-address" />
      <Field label="Anos de experiência" placeholder="Ex: 5" keyboardType="numeric" />

      <Text className="text-textmuted text-sm mb-2">Função</Text>
      <View className="flex-row gap-3 mb-5">
        {ROLES.map((r) => {
          const active = r === role;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              className={`flex-1 py-3 rounded-2xl border items-center ${active ? "border-gold bg-goldDark/20" : "border-border bg-surface"}`}
            >
              <Text className={active ? "text-gold font-semibold" : "text-textmuted"}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Field label="Horário de Trabalho" placeholder="Ter–Dom · 10h às 18h" />

      <View className="h-2" />
      <GoldButton title="Cadastrar Barbeiro" onPress={onBack} />
    </ScrollView>
  );
}

function Field({ label, placeholder, keyboardType }: { label: string; placeholder: string; keyboardType?: KeyboardTypeOptions }) {
  return (
    <View className="mb-4">
      <Text className="text-textmuted text-sm mb-2">{label}</Text>
      <View className="bg-surface border border-border rounded-2xl px-4 py-4">
        <TextInput placeholder={placeholder} placeholderTextColor="#6B6B75" className="text-white" keyboardType={keyboardType} />
      </View>
    </View>
  );
}
