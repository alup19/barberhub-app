import { router } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoldButton } from "../components/GoldButton";

export default function Splash() {
  return (
    <SafeAreaView className="flex-1 bg-bg bg-[#110F0E]">
      <View className="flex-1 items-center justify-center">
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            shadowColor: "#e2b558",
            shadowOpacity: 0.6,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/tesoura.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 60,
            }}
          />
        </View>
        <Text className="text-text-muted text-[#CC8F33] text-4xl mt-8 tracking-widest">
          BARBER
        </Text>
        <Text className="text-text-muted text-[#988C81] text-xs tracking-[0.4em] mt-2">
          PREMIUM HUB
        </Text>
      </View>

      <View className="px-6 pb-8">
        <GoldButton label="Começar" onPress={() => router.push("/login")} />
        <Text className="text-text-dim text-center text-xs pb-14 mt-4 text-[#988C81]">
          Agende seu horário em segundos
        </Text>
      </View>
    </SafeAreaView>
  );
}
