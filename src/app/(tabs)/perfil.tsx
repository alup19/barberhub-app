import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";

const menu = [
  { icon: "calendar-outline", label: "Meus Agendamentos" },
  { icon: "star-outline", label: "Avaliações" },
  { icon: "card-outline", label: "Formas de Pagamento" },
  { icon: "notifications-outline", label: "Notificações" },
  { icon: "help-circle-outline", label: "Ajuda & Suporte" },
] as const;

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-3xl text-white mt-2 mx-5" style={{ fontFamily: "serif" }}>
          Perfil
        </Text>

        <View className="bg-bg-card mx-5 mt-4 rounded-2xl p-5 border border-line items-center">
          <View className="w-24 h-24 rounded-full bg-gold items-center justify-center">
            <Text className="text-bg text-3xl font-bold">JS</Text>
          </View>
          <Text className="text-white text-xl font-semibold mt-3">João Silva</Text>
          <Text className="text-muted text-sm">joao.silva@email.com</Text>
          <Text className="text-muted text-sm">+55 11 99999-0000</Text>

          <View className="flex-row w-full mt-5 border-t border-line pt-4">
            <Stat value="12" label="Visitas" />
            <Stat value="4.8" label="Avaliação" />
            <Stat value="R$ 580" label="Gasto total" />
          </View>

          <TouchableOpacity className="mt-5 w-full bg-bg-elevated py-3 rounded-xl items-center">
            <Text className="text-white font-semibold">Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-5 mt-6 gap-2">
          {menu.map((m) => (
            <TouchableOpacity key={m.label} className="bg-bg-card rounded-2xl px-4 py-4 flex-row items-center border border-line">
              <View className="w-9 h-9 rounded-lg bg-bg-elevated items-center justify-center">
                <Ionicons name={m.icon as any} size={18} color="#d4a24c" />
              </View>
              <Text className="text-white font-medium ml-3 flex-1">{m.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9a9a9a" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="bg-bg-card rounded-2xl px-4 py-4 flex-row items-center border border-gold/40 mt-2">
            <View className="w-9 h-9 rounded-lg bg-gold/15 items-center justify-center">
              <Ionicons name="shield-checkmark-outline" size={18} color="#d4a24c" />
            </View>
            <Text className="text-gold font-semibold ml-3 flex-1">Painel Admin</Text>
            <Ionicons name="chevron-forward" size={20} color="#d4a24c" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-bg-card rounded-2xl px-4 py-4 flex-row items-center border border-line mt-2">
            <View className="w-9 h-9 rounded-lg bg-danger/15 items-center justify-center">
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </View>
            <Text className="text-danger font-semibold ml-3 flex-1">Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigator active="profile" />
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-gold text-lg font-bold">{value}</Text>
      <Text className="text-muted text-xs mt-0.5">{label}</Text>
    </View>
  );
}
