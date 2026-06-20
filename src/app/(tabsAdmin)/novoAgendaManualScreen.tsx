import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { GoldButton } from "../../components/GoldButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useAuth } from "../../context/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Barbeiro = { id: number; nome: string; ativo: boolean };
type Servico = { id: number; nome: string; preco: number; duracaoMin: number; ativo: boolean };
type HorarioDisponivel = { id: number; diaSemana: string; inicio: string; fim: string; barbeiroId: number };
type Agendamento = { id: number; dataHora: string; status: string; barbeiroId: number; servico: { duracaoMin: number } };

const DIAS_SEMANA = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];
const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const diasSemanaLabel = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];

function minutosParaHora(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Gera senha previsível: NomeDoCliente#123 (primeiro nome, capitalizado)
function gerarSenha(nome: string): string {
  const primeiroNome = nome.trim().split(" ")[0];
  const capitalizado = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
  return `${capitalizado}#123`;
}

export default function NovoAgendamentoScreen({ onBack }: { onBack: () => void }) {
  const { usuario, fetchComAuth } = useAuth();

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [agendamentosBarbeiro, setAgendamentosBarbeiro] = useState<Agendamento[]>([]);

  const [barbeiroId, setBarbeiroId] = useState<number | null>(null);
  const [servicoId, setServicoId] = useState<number | null>(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");

  const hoje = new Date();
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);

  const [loadingDados, setLoadingDados] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarBarbeirosEServicos();
  }, []);

  useEffect(() => {
    if (barbeiroId) carregarExpedienteEAgendamentos(barbeiroId);
  }, [barbeiroId]);

  const carregarBarbeirosEServicos = async () => {
    setLoadingDados(true);
    try {
      const [resB, resS] = await Promise.all([
        fetchComAuth(`${apiUrl}/barbeiros/barbearia/${usuario?.barbeariaId}`),
        fetchComAuth(`${apiUrl}/servicos/barbearia/${usuario?.barbeariaId}`),
      ]);
      const dataB = await resB.json();
      const dataS = await resS.json();

      setBarbeiros(dataB.filter((b: Barbeiro) => b.ativo));
      setServicos(dataS.filter((s: Servico) => s.ativo).map((s: Servico) => ({ ...s, preco: Number(s.preco) })));
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar dados", text2: error.message || "Tente novamente" });
    } finally {
      setLoadingDados(false);
    }
  };

  const carregarExpedienteEAgendamentos = async (id: number) => {
    try {
      const [resH, resA] = await Promise.all([
        fetchComAuth(`${apiUrl}/horarios/barbeiro/${id}`),
        fetchComAuth(`${apiUrl}/agendamentos/barbearia/${usuario?.barbeariaId}`),
      ]);
      const dataH = await resH.json();
      const dataA = await resA.json();

      setHorarios(dataH);
      setAgendamentosBarbeiro(
        dataA.filter((a: Agendamento) => a.barbeiroId === id && a.status !== "CANCELADO")
      );
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao carregar expediente", text2: error.message || "Tente novamente" });
    }
  };

  const servico = servicos.find((s) => s.id === servicoId) ?? null;

  // Slots calculados igual fizemos no Step2 do cliente
  const timeSlots = useMemo(() => {
    if (!barbeiroId || !servico) return [];

    const diaSemana = DIAS_SEMANA[dataSelecionada.getDay()];
    const expedientesDoDia = horarios.filter((h) => h.diaSemana === diaSemana);
    if (expedientesDoDia.length === 0) return [];

    const duracao = servico.duracaoMin;
    const agora = new Date();
    const ehHoje = dataSelecionada.toDateString() === agora.toDateString();

    const agendamentosDoDia = agendamentosBarbeiro.filter(
      (a) => new Date(a.dataHora).toDateString() === dataSelecionada.toDateString()
    );

    const slots: { time: string; available: boolean }[] = [];

    expedientesDoDia.forEach((exp) => {
      const inicioMin = new Date(exp.inicio).getHours() * 60 + new Date(exp.inicio).getMinutes();
      const fimMin = new Date(exp.fim).getHours() * 60 + new Date(exp.fim).getMinutes();

      for (let m = inicioMin; m + duracao <= fimMin; m += 15) {
        const slotInicio = m;
        const slotFim = m + duracao;

        if (ehHoje) {
          const agoraMin = agora.getHours() * 60 + agora.getMinutes();
          if (slotInicio <= agoraMin) continue;
        }

        const conflito = agendamentosDoDia.some((a) => {
          const d = new Date(a.dataHora);
          const agInicio = d.getHours() * 60 + d.getMinutes();
          const agFim = agInicio + (a.servico?.duracaoMin ?? 30);
          return slotInicio < agFim && slotFim > agInicio;
        });

        slots.push({ time: minutosParaHora(slotInicio), available: !conflito });
      }
    });

    return slots;
  }, [barbeiroId, servico, dataSelecionada, horarios, agendamentosBarbeiro]);

  useEffect(() => {
    setHoraSelecionada(null);
  }, [barbeiroId, servicoId, dataSelecionada]);

  const mudarDia = (delta: number) => {
    const nova = new Date(dataSelecionada);
    nova.setDate(nova.getDate() + delta);
    nova.setHours(0, 0, 0, 0);

    const hojeZero = new Date();
    hojeZero.setHours(0, 0, 0, 0);

    if (nova < hojeZero) return; // não deixa ir antes de hoje
    setDataSelecionada(nova);
  };

  const dataFormatada = `${diasSemanaLabel[dataSelecionada.getDay()]}, ${dataSelecionada.getDate()} de ${monthNames[dataSelecionada.getMonth()]}`;

  // Garante (cria se não existir) o usuário pelo telefone, retorna o id
  const garantirUsuario = async (): Promise<string | null> => {
    const telefoneLimpo = telefoneCliente.replace(/\D/g, "");

    // 1. Tenta buscar primeiro
    try {
      const resBusca = await fetchComAuth(`${apiUrl}/usuarios/telefone/${telefoneLimpo}`);
      if (resBusca.ok) {
        const dataBusca = await resBusca.json();
        return dataBusca.id;
      }
    } catch {
      // segue pro fluxo de criar
    }

    // 2. Não existe, cria um novo
    try {
      const emailFake = `${telefoneLimpo}@cliente.local`;
      const senhaGerada = gerarSenha(nomeCliente);

      const resCriar = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCliente.trim(),
          email: emailFake,
          telefone: telefoneLimpo,
          senha: senhaGerada,
        }),
      });

      const dataCriar = await resCriar.json();

      if (!resCriar.ok) {
        throw new Error("Não foi possível cadastrar o cliente. Verifique o telefone (11 dígitos).");
      }

      return dataCriar.id;
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao cadastrar cliente", text2: error.message || "Tente novamente" });
      return null;
    }
  };

  const handleAdicionar = async () => {
    if (!barbeiroId) {
      Toast.show({ type: "error", text1: "Selecione um barbeiro" });
      return;
    }
    if (!servicoId) {
      Toast.show({ type: "error", text1: "Selecione um serviço" });
      return;
    }
    if (!nomeCliente.trim() || nomeCliente.trim().length < 3) {
      Toast.show({ type: "error", text1: "Nome do cliente deve ter pelo menos 3 caracteres" });
      return;
    }
    if (telefoneCliente.replace(/\D/g, "").length !== 11) {
      Toast.show({ type: "error", text1: "Telefone deve conter 11 dígitos" });
      return;
    }
    if (!horaSelecionada) {
      Toast.show({ type: "error", text1: "Selecione um horário" });
      return;
    }

    setEnviando(true);

    try {
      const usuarioId = await garantirUsuario();
      if (!usuarioId) {
        setEnviando(false);
        return;
      }

      const [h, m] = horaSelecionada.split(":").map(Number);
      const dataHora = new Date(dataSelecionada);
      dataHora.setHours(h, m, 0, 0);

      const response = await fetchComAuth(`${apiUrl}/agendamentos`, {
        method: "POST",
        body: JSON.stringify({
          dataHora: dataHora.toISOString(),
          usuarioId,
          servicoId,
          barbeariaId: usuario?.barbeariaId,
          barbeiroId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao criar agendamento");

      Toast.show({ type: "success", text1: "Agendamento criado com sucesso" });
      onBack();
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Erro ao agendar", text2: error.message || "Tente novamente" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <ScreenHeader title="Novo Agendamento" onBack={onBack} />
      <Text className="text-[#988C81] text-xs tracking-widest mb-4">HORÁRIO MANUAL</Text>

      <Label>Data</Label>
      <View className="flex-row items-center gap-3 mb-4">
        <TouchableOpacity
          onPress={() => mudarDia(-1)}
          className="w-10 h-10 rounded-xl bg-[#1B1B1B] border border-[#3A3A3A] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={18} color="#988C81" />
        </TouchableOpacity>
        <View className="flex-1 bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4 flex-row items-center">
          <Text className="text-[#988C81] flex-1">{dataFormatada}</Text>
          <Ionicons name="calendar-outline" size={18} color="#D4A24C" />
        </View>
        <TouchableOpacity
          onPress={() => mudarDia(1)}
          className="w-10 h-10 rounded-xl bg-[#1B1B1B] border border-[#3A3A3A] items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={18} color="#988C81" />
        </TouchableOpacity>
      </View>

      <Label>Cliente</Label>
      <FieldRow>
        <Ionicons name="person-outline" size={18} color="#9A9AA5" />
        <TextInput
          placeholder="Nome do cliente..."
          placeholderTextColor="#6B6B75"
          className="text-white flex-1 ml-2"
          value={nomeCliente}
          onChangeText={setNomeCliente}
        />
      </FieldRow>
      <FieldRow>
        <Ionicons name="call-outline" size={18} color="#9A9AA5" />
        <TextInput
          placeholder="Telefone (11 dígitos)..."
          placeholderTextColor="#6B6B75"
          className="text-white flex-1 ml-2"
          keyboardType="phone-pad"
          value={telefoneCliente}
          onChangeText={setTelefoneCliente}
        />
      </FieldRow>

      <Label>Barbeiro</Label>
      {loadingDados && <Text className="text-[#988C81] text-sm mb-4">Carregando barbeiros...</Text>}
      <View className="flex-row gap-3 mb-5 flex-wrap">
        {barbeiros.map((b) => {
          const active = b.id === barbeiroId;
          return (
            <TouchableOpacity
              key={b.id}
              onPress={() => setBarbeiroId(b.id)}
              className={`flex-1 items-center py-3 rounded-2xl border ${active ? "border-[#CC8F33] bg-[#1B1B1B]" : "border-[#3A3A3A] bg-[#1B1B1B]"}`}
              style={{ minWidth: "30%" }}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${active ? "bg-[#CC8F3320]" : "bg-[#1B1B1B]"}`}>
                <Text className={`font-bold text-lg ${active ? "text-[#CC8F33]" : "text-[#988C81]"}`}>{b.nome[0]}</Text>
              </View>
              <Text className={active ? "text-[#CC8F33]" : "text-[#988C81]"} numberOfLines={1}>
                {b.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Label>Serviço</Label>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {servicos.map((s) => {
          const active = s.id === servicoId;
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => setServicoId(s.id)}
              className={`px-4 py-2.5 rounded-xl border ${active ? "border-[#CC8F33] bg-[#CC8F3320]" : "border-[#3A3A3A] bg-[#1B1B1B]"}`}
            >
              <Text className={active ? "text-[#CC8F33] font-semibold" : "text-[#988C81]"}>
                {s.nome} · R$ {s.preco.toFixed(2).replace(".", ",")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {barbeiroId && servicoId && (
        <>
          <Label>Horário disponível</Label>
          {timeSlots.length === 0 && (
            <Text className="text-[#988C81] text-sm mb-4">
              Barbeiro não atende neste dia ou não há horário livre. Tente outra data.
            </Text>
          )}
          <View className="flex-row flex-wrap mb-8" style={{ gap: 10 }}>
            {timeSlots.map((s) => {
              const sel = s.time === horaSelecionada && s.available;
              return (
                <TouchableOpacity
                  key={s.time}
                  disabled={!s.available}
                  onPress={() => setHoraSelecionada(s.time)}
                  style={{ width: "22%" }}
                  className={`py-3 rounded-xl items-center border ${
                    sel
                      ? "bg-[#CC8F33] border-[#CC8F33]"
                      : !s.available
                      ? "bg-[#252525] border-[#3A3A3A] opacity-40"
                      : "bg-[#1B1B1B] border-[#3A3A3A]"
                  }`}
                >
                  <Text className={sel ? "text-black font-bold" : "text-white"}>{s.time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <GoldButton
        title={enviando ? "Adicionando..." : "Adicionar Agendamento"}
        onPress={handleAdicionar}
        disabled={enviando}
      />
    </ScrollView>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[#988C81] text-sm mb-2 mt-1">{children}</Text>
);
const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-2xl px-4 py-4 flex-row items-center mb-4">{children}</View>
);