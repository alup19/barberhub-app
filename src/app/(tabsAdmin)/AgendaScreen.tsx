import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GoldButton } from "../../components/GoldButton";
import StatusBadge from "../../components/StatusBadge";
import { adminAppointments as appointments, type AdminAppointment as Appointment } from "../../constants/data";

type Props = { onNew: () => void };

export default function AgendaScreen({ onNew }: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-textmuted text-xs tracking-widest mb-1">SEGUNDA-FEIRA, 7 ABR</Text>
          <Text className="text-white text-3xl" style={{ fontFamily: "serif", fontWeight: "700" }}>
            Bom dia, João ✂️
          </Text>
        </View>
        <View className="w-11 h-11 rounded-full bg-goldDark items-center justify-center">
          <Text className="text-white font-bold">C</Text>
        </View>
      </View>

      <View className="flex-row gap-3 mb-6">
        <StatCard label="HOJE" value="8" sub="agendamentos" />
        <StatCard label="CONFIRMA DOS" value="5" sub="confirmados" valueColor="text-gold" />
        <StatCard label="RECEITA" value="R$320" sub="estimado" />
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-bold">Agenda de Hoje</Text>
        <TouchableOpacity><Text className="text-gold text-sm">Ver tudo</Text></TouchableOpacity>
      </View>

      <View className="gap-3 mb-6">
        {appointments.map((a) => <AppointmentRow key={a.id} a={a} />)}
      </View>

      <GoldButton title="Agendamento Manual" onPress={onNew} />
    </ScrollView>
  );
}

function StatCard({ label, value, sub, valueColor = "text-white" }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <View className="flex-1 bg-surface rounded-2xl p-3 border border-border">
      <Text className="text-textmuted text-[10px] tracking-widest mb-2">{label}</Text>
      <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
      <Text className="text-textmuted text-xs mt-1">{sub}</Text>
    </View>
  );
}

function AppointmentRow({ a }: { a: Appointment }) {
  const cancelled = a.status === "Cancelado";
  return (
    <View className={`bg-surface border border-border rounded-2xl p-4 flex-row items-center ${cancelled ? "opacity-60" : ""}`}>
      <View className="w-14">
        <Text className={`font-bold ${a.status === "Próximo" ? "text-gold" : "text-white"} ${cancelled ? "line-through" : ""}`}>
          {a.time}
        </Text>
        <Text className="text-textmuted text-xs mt-1">{a.duration}</Text>
      </View>
      <View className="w-px h-10 bg-border mx-3" />
      <View className="w-9 h-9 rounded-full bg-surface2 items-center justify-center mr-3 border border-border">
        <Text className="text-gold font-bold">{a.initial}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold">{a.name}</Text>
        <Text className="text-textmuted text-xs mt-0.5">{a.service}</Text>
      </View>
      <StatusBadge label={a.status} />
    </View>
  );
}
