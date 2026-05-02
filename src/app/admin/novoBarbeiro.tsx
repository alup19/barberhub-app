import { router } from "expo-router";
import NovoBarbeiroScreen from "../(tabsAdmin)/novoBarbeiroScreen";

export default function NovoBarbeiroPage() {
  return <NovoBarbeiroScreen onBack={() => router.back()} />;
}
