import { router } from "expo-router";
import NovoBarbeiroScreen from "../(tabsAdmin)/NovoBarbeiroScreen";

export default function NovoBarbeiroPage() {
  return <NovoBarbeiroScreen onBack={() => router.back()} />;
}
