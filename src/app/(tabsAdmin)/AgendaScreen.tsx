import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import StatusBadge from "../../components/StatusBadge";
import { adminAppointments as appointments, type AdminAppointment as Appointment } from "../../constants/data";
import { LinearGradient } from "expo-linear-gradient";

const GRADIENT_COLORS = ["#CC8F33", "#CC8F33", "#e2b558"] as const;

type Props = { onNew: () => void };

export default function AgendaScreen({ onNew }: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, backgroundColor: "#110F0E" }}>
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-textmuted text-xs tracking-widest mb-1 text-[#988C81]">SEGUNDA-FEIRA, 7 ABR</Text>
          <Text className="text-white text-2xl" style={{ fontFamily: "Arial", fontWeight: "700" }}>
            Bom dia, João ✂️
          </Text>
        </View>
        <View className="w-11 h-11 rounded-full bg-goldDark items-center justify-center">
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }}
          >
            <Text className="text-black font-bold">C</Text>
          </LinearGradient>
        </View>
      </View>

      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81]  text-xs">
            HOJE
          </Text>

          <Text className="text-white text-2xl font-bold mt-1">
            8
          </Text>

          <Text className="text-[#988C81] text-sm mt-1">
            agendamento
          </Text>
        </View>

        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81] text-xs">
            CONFIRMADOS
          </Text>

          <Text className="text-[#CC8F33] text-2xl font-bold mt-1">
            5
          </Text>

          <Text className="text-[#988C81] text-sm mt-1">
            confirmado
          </Text>
        </View>

        <View className="flex-1 bg-[#1B1B1B] rounded-2xl p-4">
          <Text className="text-[#988C81] text-xs">
            RECEITA
          </Text>

          <Text className="text-white text-2xl font-bold mt-1">
            R$320
          </Text>

          <Text className="text-[#988C81] text-sm mt-1">
            estimado
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-bold">Agenda de Hoje</Text>
        <TouchableOpacity><Text className="text-[#CC8F33] text-sm">Ver tudo</Text></TouchableOpacity>
      </View>

      <View className="gap-3 mb-6">
        {appointments.map((a) => <AppointmentRow key={a.id} a={a} />)}
      </View>

      <GoldButton title="Agendamento Manual" onPress={onNew} />
    </ScrollView>
  );
}

function AppointmentRow({ a }: { a: Appointment }) {
  const cancelled = a.status === "Cancelado";
  return (
    <View className={`bg-[#1B1B1B] border border-[#ffffff25] rounded-2xl p-4 flex-row items-center ${cancelled ? "opacity-60" : ""}`}>
      <View className="w-14">
        <Text className={`text-lg font-bold ${a.status === "Próximo" ? "text-[#CC8F33]" : "text-[#988C81]"} ${cancelled ? "line-through" : ""}`}>
          {a.time}
        </Text>
        <Text className="text-textmuted text-[#988C81] text-xs mt-1">{a.duration}</Text>
      </View>
      <View className={`w-[.5px] h-12 mx-3 ${a.status === "Próximo" ? "bg-[#CC8F33]" : "bg-[#988C81]"} ${cancelled ? "bg-[#DC2828]" : ""} ${cancelled ? "line-through" : ""}`} />
      <View className="w-10 h-10 rounded-full bg-[#292623] items-center justify-center mr-3">
        <Text className={`text-base ${a.status === "Próximo" ? "text-[#CC8F33]" : "text-[#988C81]"} ${cancelled ? "text-[#DC2828]" : ""}`}>{a.initial}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white text-base font-semibold">{a.name}</Text>
        <Text className="text-[#988C81] text-xs mt-0.5">{a.service}</Text>
      </View>
      <StatusBadge label={a.status} />
    </View>
  );
}
