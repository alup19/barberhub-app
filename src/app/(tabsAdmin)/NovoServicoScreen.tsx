import { useState } from "react";
import { KeyboardTypeOptions, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";

const CATS = ["Cortes", "Barba", "Estética", "Premium"];

export default function NovoServicoScreen({ onBack }: { onBack: () => void }) {
  const [cat, setCat] = useState("Cortes");
  const [active, setActive] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Novo Serviço" onBack={onBack} />
      <Text className="text-[#988C81] text-xs tracking-widest mb-4">CADASTRO DE SERVIÇO</Text>

      <Field label="Nome do serviço" placeholder="Ex: Corte + Barba" />
      <Field label="Descrição" placeholder="Detalhes do serviço..." multiline />

      <View className="flex-row gap-3">
        <View className="flex-1"><Field label="Preço (R$)" placeholder="55" keyboardType="numeric" /></View>
        <View className="flex-1"><Field label="Duração (min)" placeholder="45" keyboardType="numeric" /></View>
      </View>

      <Text className="text-[#988C81] text-sm mb-2">Categoria</Text>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {CATS.map((c) => {
          const a = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              className={`px-4 py-2.5 rounded-xl border ${a ? "border-[#CC8F33] bg-[#CC8F3320]" : "border-[#3A3A3A] bg-[#1B1B1B]"}`}
            >
              <Text className={a ? "text-[#CC8F33] font-semibold" : "text-[#988C81]"}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4 flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-white font-semibold">Serviço ativo</Text>
          <Text className="text-[#988C81] text-xs mt-0.5">Aparece para agendamento</Text>
        </View>
        <Switch value={active} onValueChange={setActive} trackColor={{ true: "#D4A24C", false: "#26262F" }} thumbColor="#fff" />
      </View>

      <GoldButton title="Cadastrar Serviço" onPress={onBack} />
    </ScrollView>
  );
}

function Field({ label, placeholder, keyboardType, multiline }: { label: string; placeholder: string; keyboardType?: KeyboardTypeOptions; multiline?: boolean }) {
  return (
    <View className="mb-4">
      <Text className="text-[#988C81] text-sm mb-2">{label}</Text>
      <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4">
        <TextInput placeholder={placeholder} placeholderTextColor="#988C81" className="text-[#988C81]" keyboardType={keyboardType} multiline={multiline} />
      </View>
    </View>
  );
}