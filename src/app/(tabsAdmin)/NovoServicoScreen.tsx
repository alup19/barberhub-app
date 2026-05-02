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
      <Text className="text-textmuted text-xs tracking-widest mb-4">CADASTRO DE SERVIÇO</Text>

      <Field label="Nome do serviço" placeholder="Ex: Corte + Barba" />
      <Field label="Descrição" placeholder="Detalhes do serviço..." multiline />

      <View className="flex-row gap-3">
        <View className="flex-1"><Field label="Preço (R$)" placeholder="55" keyboardType="numeric" /></View>
        <View className="flex-1"><Field label="Duração (min)" placeholder="45" keyboardType="numeric" /></View>
      </View>

      <Text className="text-textmuted text-sm mb-2">Categoria</Text>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {CATS.map((c) => {
          const a = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              className={`px-4 py-2.5 rounded-xl border ${a ? "border-gold bg-goldDark/20" : "border-border bg-surface"}`}
            >
              <Text className={a ? "text-gold font-semibold" : "text-textmuted"}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-white font-semibold">Serviço ativo</Text>
          <Text className="text-textmuted text-xs mt-0.5">Aparece para agendamento</Text>
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
      <Text className="text-textmuted text-sm mb-2">{label}</Text>
      <View className="bg-surface border border-border rounded-2xl px-4 py-4">
        <TextInput placeholder={placeholder} placeholderTextColor="#6B6B75" className="text-white" keyboardType={keyboardType} multiline={multiline} />
      </View>
    </View>
  );
}
