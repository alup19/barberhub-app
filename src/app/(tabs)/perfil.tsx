import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";
import { useAuth } from "../../context/AuthContext";

const menu = [
  { icon: "calendar-outline", label: "Meus Agendamentos" },
  { icon: "star-outline", label: "Avaliações" },
  { icon: "card-outline", label: "Formas de Pagamento" },
  { icon: "notifications-outline", label: "Notificações" },
  { icon: "help-circle-outline", label: "Ajuda & Suporte" },
] as const;

export default function Profile() {
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text className="text-3xl text-white mt-2 mx-5 pt-8" style={{ fontFamily: "serif" }}>
          Perfil
        </Text>

        <View className="bg-[#1B1B1B] mx-5 mt-4 rounded-2xl p-5 border border-[#3A3A3A] items-center">
          <View className="w-24 h-24 rounded-full bg-[#CC8F3320] items-center justify-center">
            <Text className="text-[#CC8F33] text-3xl font-bold">JS</Text>
          </View>
          <Text className="text-white text-xl font-semibold mt-3">João Silva</Text>
          <Text className="text-[#988C81] text-sm">joao.silva@email.com</Text>
          <Text className="text-[#988C81] text-sm">+55 11 99999-0000</Text>

          <View className="flex-row w-full mt-5 border-t border-[#3A3A3A] pt-4">
            <Stat value="12" label="Visitas" />
            <Stat value="4.8" label="Avaliação" />
            <Stat value="R$ 580" label="Gasto total" />
          </View>

          <TouchableOpacity className="mt-5 w-full bg-[#252525] py-3 rounded-xl items-center">
            <Text className="text-white font-semibold">Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-5 mt-6 gap-2">
          {menu.map((m) => (
            <TouchableOpacity key={m.label} className="bg-[#1B1B1B] rounded-2xl px-4 py-4 flex-row items-center border border-[#3A3A3A]">
              <View className="w-9 h-9 rounded-lg bg-[#252525] items-center justify-center">
                <Ionicons name={m.icon as any} size={18} color="#D4A24C" />
              </View>
              <Text className="text-white font-medium ml-3 flex-1">{m.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9A9AA5" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="bg-[#1B1B1B] rounded-2xl px-4 py-4 flex-row items-center border border-[#CC8F3340] mt-2" onPress={() => router.push('/admin')}>
            <View className="w-9 h-9 rounded-lg bg-[#CC8F3320] items-center justify-center">
              <Ionicons name="shield-checkmark-outline" size={18} color="#D4A24C" />
            </View>
            <Text className="text-[#CC8F33] font-semibold ml-3 flex-1">Painel Admin</Text>
            <Ionicons name="chevron-forward" size={20} color="#D4A24C" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#1B1B1B] rounded-2xl px-4 py-4 flex-row items-center border border-[#3A3A3A] mt-2">
            <View className="w-9 h-9 rounded-lg bg-[#E5484D20] items-center justify-center">
              <Ionicons name="log-out-outline" size={18} color="#E5484D" />
            </View>
            <Text className="text-[#E5484D] font-semibold ml-3 flex-1" onPress={async () => {
              await logout();
              router.replace("/login");
            }}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigator active="perfil" />
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-[#CC8F33] text-lg font-bold">{value}</Text>
      <Text className="text-[#988C81] text-xs mt-0.5">{label}</Text>
    </View>
  );
}