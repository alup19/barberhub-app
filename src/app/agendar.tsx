import { useEffect } from "react";
import { router } from "expo-router";
import { View } from "react-native";

export default function Agendar() {
  useEffect(() => {
    router.replace("/booking/step1");
  }, []);
  return <View className="flex-1 bg-bg" />;
}
