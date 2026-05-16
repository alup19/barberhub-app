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
      <Text className="text-[#988C81] text-xs tracking-widest mb-4">CADASTRO DA EQUIPE</Text>

      <Field label="Nome completo" placeholder="Ex: Carlos Silva" />
      <Field label="Telefone" placeholder="(11) 91234-5678" keyboardType="phone-pad" />
      <Field label="E-mail" placeholder="email@barbearia.com" keyboardType="email-address" />
      <Field label="Anos de experiência" placeholder="Ex: 5" keyboardType="numeric" />

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

      <Field label="Horário de Trabalho" placeholder="Ter–Dom · 10h às 18h" />

      <View className="h-2" />
      <GoldButton title="Cadastrar Barbeiro" onPress={onBack} />
    </ScrollView>
  );
}

function Field({ label, placeholder, keyboardType }: { label: string; placeholder: string; keyboardType?: KeyboardTypeOptions }) {
  return (
    <View className="mb-4">
      <Text className="text-[#988C81] text-sm mb-2">{label}</Text>
      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4">
        <TextInput placeholder={placeholder} placeholderTextColor="#988C81" className="text-[#988C81]" keyboardType={keyboardType} />
      </View>
    </View>
  );
}