import { router } from "expo-router";
import NovoAgendamentoScreen from "../(tabsAdmin)/novoAgendaManualScreen";

export default function NovoAgendamentoPage() {
  return <NovoAgendamentoScreen onBack={() => router.back()} />;
}
