import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DIAS = [
  { value: "SEGUNDA", label: "Segunda-feira" },
  { value: "TERCA", label: "Terça-feira" },
  { value: "QUARTA", label: "Quarta-feira" },
  { value: "QUINTA", label: "Quinta-feira" },
  { value: "SEXTA", label: "Sexta-feira" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
];

type HorarioDisponivel = {
  id: number;
  diaSemana: string;
  inicio: string;
  fim: string;
  barbeiroId: number;
};

type DiaConfig = {
  ativo: boolean;
  inicio: string; // "HH:MM"
  fim: string; // "HH:MM"
  idExistente: number | null; // se já existe no backend, guarda o id pra fazer PUT
};

const HORARIO_PADRAO_INICIO = "09:00";
const HORARIO_PADRAO_FIM = "18:00";

// Monta um Date qualquer (hoje) com a hora especificada, pra mandar pro backend como ISO
function horaParaDate(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateParaHora(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HorariosBarbeiroScreen({
  barbeiro,
  onBack,
}: {
  barbeiro: { id: number; nome: string };
  onBack: () => void;
}) {
  const { fetchComAuth } = useAuth();

  const [config, setConfig] = useState<Record<string, DiaConfig>>(() => {
    const base: Record<string, DiaConfig> = {};
    DIAS.forEach((d) => {
      base[d.value] = { ativo: false, inicio: HORARIO_PADRAO_INICIO, fim: HORARIO_PADRAO_FIM, idExistente: null };
    });
    return base;
  });

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarHorarios();
  }, []);

  const carregarHorarios = async () => {
    setLoading(true);
    try {
      const response = await fetchComAuth(`${apiUrl}/horarios/barbeiro/${barbeiro.id}`);
      const data: HorarioDisponivel[] = await response.json();
      if (!response.ok) throw new Error((data as any).erro || "Erro ao buscar horários");

      setConfig((prev) => {
        const novo = { ...prev };
        data.forEach((h) => {
          novo[h.diaSemana] = {
            ativo: true,
            inicio: dateParaHora(h.inicio),
            fim: dateParaHora(h.fim),
            idExistente: h.id,
          };
        });
        return novo;
      });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar horários", text2: error.message || "Tente novamente" });
    } finally {
      setLoading(false);
    }
  };

  const toggleDia = (dia: string) => {
    setConfig((prev) => ({ ...prev, [dia]: { ...prev[dia], ativo: !prev[dia].ativo } }));
  };

  const ajustarHora = (dia: string, campo: "inicio" | "fim", valor: string) => {
    setConfig((prev) => ({ ...prev, [dia]: { ...prev[dia], [campo]: valor } }));
  };

  const validarHorarios = (): string | null => {
    for (const dia of DIAS) {
      const c = config[dia.value];
      if (!c.ativo) continue;

      if (!/^\d{2}:\d{2}$/.test(c.inicio) || !/^\d{2}:\d{2}$/.test(c.fim)) {
        return `Horário inválido em ${dia.label}`;
      }

      const [hi, mi] = c.inicio.split(":").map(Number);
      const [hf, mf] = c.fim.split(":").map(Number);

      if (hi > 23 || mi > 59 || hf > 23 || mf > 59) {
        return `Horário inválido em ${dia.label}`;
      }

      if (hi * 60 + mi >= hf * 60 + mf) {
        return `Em ${dia.label}, o horário de início deve ser antes do fim`;
      }
    }
    return null;
  };

  const handleSalvar = async () => {
    const erroValidacao = validarHorarios();
    if (erroValidacao) {
      Toast.show({ type: "error", text1: erroValidacao });
      return;
    }

    setSalvando(true);

    try {
      for (const dia of DIAS) {
        const c = config[dia.value];

        // Dia desativado mas já existia no backend -> excluir
        if (!c.ativo && c.idExistente) {
          await fetchComAuth(`${apiUrl}/horarios/${c.idExistente}`, { method: "DELETE" });
          continue;
        }

        // Dia desativado e nunca existiu -> não faz nada
        if (!c.ativo) continue;

        const inicioDate = horaParaDate(c.inicio);
        const fimDate = horaParaDate(c.fim);

        if (c.idExistente) {
          // Já existe -> atualiza
          await fetchComAuth(`${apiUrl}/horarios/${c.idExistente}`, {
            method: "PUT",
            body: JSON.stringify({
              inicio: inicioDate.toISOString(),
              fim: fimDate.toISOString(),
            }),
          });
        } else {
          // Não existe -> cria
          await fetchComAuth(`${apiUrl}/horarios`, {
            method: "POST",
            body: JSON.stringify({
              diaSemana: dia.value,
              inicio: inicioDate.toISOString(),
              fim: fimDate.toISOString(),
              barbeiroId: barbeiro.id,
            }),
          });
        }
      }

      Toast.show({ type: "success", text1: "Horários salvos com sucesso" });
      setTimeout(onBack, 1000);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao salvar horários", text2: error.message || "Tente novamente" });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Horários" onBack={onBack} />
      <Text className="text-[#988C81] text-xs tracking-widest mb-1">EXPEDIENTE DE</Text>
      <Text className="text-white text-lg font-bold mb-5">{barbeiro.nome}</Text>

      {loading && (
        <View className="items-center justify-center py-8">
          <Text className="text-[#988C81]">Carregando...</Text>
        </View>
      )}

      {!loading && (
        <View className="gap-3">
          {DIAS.map((dia) => {
            const c = config[dia.value];
            return (
              <View
                key={dia.value}
                className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl p-4"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white font-semibold">{dia.label}</Text>
                  <Switch
                    value={c.ativo}
                    onValueChange={() => toggleDia(dia.value)}
                    trackColor={{ true: "#D4A24C", false: "#26262F" }}
                    thumbColor="#fff"
                  />
                </View>

                {c.ativo && (
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-[#988C81] text-xs mb-1.5">Início</Text>
                      <HoraInput
                        value={c.inicio}
                        onChange={(v) => ajustarHora(dia.value, "inicio", v)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#988C81] text-xs mb-1.5">Fim</Text>
                      <HoraInput
                        value={c.fim}
                        onChange={(v) => ajustarHora(dia.value, "fim", v)}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      <View className="h-6" />
      <GoldButton
        title={salvando ? "Salvando..." : "Salvar horários"}
        onPress={handleSalvar}
        disabled={salvando || loading}
      />
    </ScrollView>
  );
}

// Input simples de hora no formato HH:MM, com botões +/- de 30 min pra evitar erro de digitação
function HoraInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ajustar = (delta: number) => {
    const [h, m] = value.split(":").map(Number);
    let totalMin = h * 60 + m + delta;
    if (totalMin < 0) totalMin = 0;
    if (totalMin > 23 * 60 + 30) totalMin = 23 * 60 + 30;
    const novaHora = Math.floor(totalMin / 60);
    const novoMin = totalMin % 60;
    onChange(`${String(novaHora).padStart(2, "0")}:${String(novoMin).padStart(2, "0")}`);
  };

  return (
    <View className="flex-row items-center bg-[#0E0E0E] border border-[#3A3A3A] rounded-xl px-2 py-2">
      <TouchableOpacity onPress={() => ajustar(-30)} className="px-2 py-1">
        <Ionicons name="remove" size={16} color="#988C81" />
      </TouchableOpacity>
      <Text className="text-white font-semibold flex-1 text-center">{value}</Text>
      <TouchableOpacity onPress={() => ajustar(30)} className="px-2 py-1">
        <Ionicons name="add" size={16} color="#988C81" />
      </TouchableOpacity>
    </View>
  );
}