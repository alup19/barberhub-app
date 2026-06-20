import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useBooking } from "../../../components/BookingContext";
import PrimaryButton from "../../../components/PrimaryButton";
import ScreenHeader from "../../../components/ScreenHeader";
import Stepper from "../../../components/Stepper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const dayHeaders = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const DIAS_SEMANA = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

type HorarioDisponivel = {
  id: number;
  diaSemana: string;
  inicio: string; // ISO date
  fim: string; // ISO date
  barbeiroId: number;
};

type Agendamento = {
  id: number;
  dataHora: string;
  status: string;
  servico: { duracaoMin: number };
  barbeiroId: number;
};

function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - startWeekday + 1, current: false });
  return cells;
}

function isDiaPassado(year: number, month: number, day: number): boolean {
  const data = new Date(year, month, day);
  data.setHours(0, 0, 0, 0);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return data < hoje;
}

// Converte minutos do dia (0-1439) para "HH:MM"
function minutosParaHora(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Step2() {
  const { usuario, fetchComAuth } = useAuth();
  const { barber, service, setDate, setTime } = useBooking();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  const cells = useMemo(() => buildMonth(year, month), [year, month]);

  const next = () => { const d = new Date(year, month + 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };
  const prev = () => { const d = new Date(year, month - 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };

  useEffect(() => {
    if (!barber) return;
    carregarDados();
  }, [barber?.id]);

  const carregarDados = async () => {
    if (!barber) return;
    setLoading(true);
    try {
      const [resHorarios, resAgendamentos] = await Promise.all([
        fetchComAuth(`${apiUrl}/horarios/barbeiro/${barber.id}`),
        fetchComAuth(`${apiUrl}/agendamentos/barbearia/${usuario?.barbeariaId}`),
      ]);

      const dataHorarios = await resHorarios.json();
      const dataAgendamentos = await resAgendamentos.json();

      if (!resHorarios.ok) throw new Error(dataHorarios.erro || "Erro ao buscar horários");
      if (!resAgendamentos.ok) throw new Error(dataAgendamentos.erro || "Erro ao buscar agendamentos");

      setHorarios(dataHorarios);
      setAgendamentos(
        dataAgendamentos.filter(
          (a: Agendamento) => a.barbeiroId === barber.id && a.status !== "CANCELADO"
        )
      );
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Data selecionada como objeto Date real
  const selectedDate = useMemo(() => {
    if (selectedDay === null) return null;
    return new Date(year, month, selectedDay);
  }, [year, month, selectedDay]);

  // Slots calculados para o dia selecionado
  const timeSlots = useMemo(() => {
    if (!selectedDate || !service) return [];

    const diaSemana = DIAS_SEMANA[selectedDate.getDay()];
    const expedientesDoDia = horarios.filter((h) => h.diaSemana === diaSemana);

    if (expedientesDoDia.length === 0) return [];

    const duracao = service.duracaoMin;
    const agora = new Date();
    const ehHoje = selectedDate.toDateString() === agora.toDateString();

    // Agendamentos do barbeiro nesse dia específico
    const agendamentosDoDia = agendamentos.filter((a) => {
      const dataAg = new Date(a.dataHora);
      return dataAg.toDateString() === selectedDate.toDateString();
    });

    const slots: { time: string; available: boolean }[] = [];

    expedientesDoDia.forEach((exp) => {
      const inicioMin = new Date(exp.inicio).getHours() * 60 + new Date(exp.inicio).getMinutes();
      const fimMin = new Date(exp.fim).getHours() * 60 + new Date(exp.fim).getMinutes();

      // Gera slots de 30 em 30 min dentro do expediente
      for (let m = inicioMin; m + duracao <= fimMin; m += 30) {
        const slotInicio = m;
        const slotFim = m + duracao;

        // Bloqueia horário passado se for hoje
        if (ehHoje) {
          const agoraMin = agora.getHours() * 60 + agora.getMinutes();
          if (slotInicio <= agoraMin) continue;
        }

        // Verifica conflito com agendamentos existentes
        const temConflito = agendamentosDoDia.some((a) => {
          const dataAg = new Date(a.dataHora);
          const agInicio = dataAg.getHours() * 60 + dataAg.getMinutes();
          const agFim = agInicio + (a.servico?.duracaoMin ?? 30);
          return slotInicio < agFim && slotFim > agInicio;
        });

        slots.push({ time: minutosParaHora(slotInicio), available: !temConflito });
      }
    });

    return slots;
  }, [selectedDate, horarios, agendamentos, service]);

  // Reseta horário selecionado ao trocar o dia
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDay, month, year]);

  const canContinue = selectedDay !== null && selectedTime !== null;

  if (!barber || !service) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]" edges={["top"]}>
      <ScreenHeader title="Agendar" onBack={() => router.back()} />
      <Stepper current={2} labels={["Barbeiro/Serviço", "Data/Hora", "Confirmar"]} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 18 }}>
        <View className="bg-[#1B1B1B] rounded-2xl p-4 border border-[#3A3A3A] flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-[#CC8F3320] items-center justify-center">
            <Text className="text-[#CC8F33] font-bold">{barber.nome.substring(0, 1)}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold">{barber.nome}</Text>
            <Text className="text-[#988C81] text-xs">{barber.funcao}</Text>
            <View className="mt-2 flex-row gap-2">
              <View className="bg-[#252525] px-2 py-1 rounded-full">
                <Text className="text-[#988C81] text-xs">{service.nome}</Text>
              </View>
              <View className="bg-[#CC8F3320] px-2 py-1 rounded-full">
                <Text className="text-[#CC8F33] text-xs font-bold">R$ {service.preco.toFixed(2).replace(".", ",")}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text className="text-white text-base font-semibold">Escolha o dia</Text>

        <View className="bg-[#1B1B1B] rounded-2xl p-4 border border-[#3A3A3A]">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={prev} className="w-9 h-9 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white font-semibold">{monthNames[month]} {year}</Text>
            <TouchableOpacity onPress={next} className="w-9 h-9 rounded-lg bg-[#252525] items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            {dayHeaders.map((h) => (
              <View key={h} className="flex-1 items-center py-1">
                <Text className="text-[#988C81] text-xs">{h}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {cells.map((c, i) => {
              const isSelected = c.current && c.day === selectedDay;
              const passado = c.current && isDiaPassado(year, month, c.day);
              const desabilitado = !c.current || passado;

              return (
                <TouchableOpacity
                  key={i}
                  disabled={desabilitado}
                  onPress={() => c.current && !passado && setSelectedDay(c.day)}
                  style={{ width: `${100 / 7}%` }}
                  className="items-center py-2"
                >
                  <View className={`w-9 h-9 rounded-full items-center justify-center ${isSelected ? "bg-[#CC8F33]" : ""}`}>
                    <Text
                      className={`${isSelected
                        ? "text-black font-bold"
                        : passado
                          ? "text-[#988C81] opacity-30"
                          : c.current
                            ? "text-white"
                            : "text-[#988C81] opacity-40"
                        }`}
                    >
                      {c.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text className="text-white text-base font-semibold">Horários disponíveis</Text>

        {loading && <Text className="text-[#988C81] text-sm">Carregando horários...</Text>}

        {!loading && timeSlots.length === 0 && (
          <Text className="text-[#988C81] text-sm">
            O barbeiro não atende neste dia. Escolha outra data.
          </Text>
        )}

        <View className="flex-row flex-wrap justify-between" style={{ gap: 10 }}>
          {timeSlots.map((s) => {
            const sel = s.time === selectedTime && s.available;
            return (
              <TouchableOpacity
                key={s.time}
                disabled={!s.available}
                onPress={() => setSelectedTime(s.time)}
                style={{ width: "31%" }}
                className={`py-3 rounded-xl items-center border ${sel
                  ? "bg-[#CC8F33] border-[#CC8F33]"
                  : !s.available
                    ? "bg-[#252525] border-[#3A3A3A] opacity-40"
                    : "bg-[#1B1B1B] border-[#3A3A3A]"
                  }`}
              >
                <Text className={`${sel ? "text-black font-bold" : "text-white"}`}>{s.time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#110F0E] border-t border-[#3A3A3A] p-5">
        <PrimaryButton
          label="Continuar para confirmação"
          icon="arrow-forward"
          disabled={!canContinue}
          onPress={() => {
            if (!selectedDate) return;
            // Guarda a data como ISO para facilitar montar o dataHora completo no Step 3
            setDate(selectedDate.toISOString());
            setTime(selectedTime!);
            router.push("/reserva/confirmar");
          }}
        />
      </View>
    </SafeAreaView>
  );
}