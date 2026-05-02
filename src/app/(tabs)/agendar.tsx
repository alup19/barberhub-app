import { useEffect } from "react";
import { router } from "expo-router";
import { View } from "react-native";

export default function Agendar() {
  useEffect(() => {
    router.replace("/reserva/passo1");
  }, []);
  return <View className="flex-1 bg-bg" />;
}
