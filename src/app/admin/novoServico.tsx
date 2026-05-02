import { router } from "expo-router";
import NovoServicoScreen from "../(tabsAdmin)/novoServicoScreen";

export default function NovoServicoPage() {
  return <NovoServicoScreen onBack={() => router.back()} />;
}
