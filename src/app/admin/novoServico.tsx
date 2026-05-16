import { router } from "expo-router";
import NovoServicoScreen from "../(tabsAdmin)/NovoServicoScreen";

export default function NovoServicoPage() {
  return <NovoServicoScreen onBack={() => router.back()} />;
}
