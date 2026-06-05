import { router, Redirect } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoldButton } from "../components/GoldButton";
import { useAuth } from "../context/AuthContext";

export default function Splash() {
  const { usuario, loading } = useAuth();

  if (loading) return null;
  if (usuario) return <Redirect href="/(tabs)/home" />;

  return (
    <ImageBackground
      source={require("../../assets/images/splashimage.png")}
      resizeMode="cover"
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
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

            <Text className="text-4xl mt-8 tracking-widest" style={{ color: "#CC8F33" }}>
              BARBER
            </Text>

            <Text className="text-xs mt-2" style={{ color: "#988C81", letterSpacing: 6 }}>
              PREMIUM HUB
            </Text>

            <Text className="text-center text-xl pb-14 mt-4" style={{ color: "#988C81" }}>
              Agende seu horário em segundos
            </Text>
          </View>

          <View className="px-6" style={{ paddingBottom: 32 }}>
            <GoldButton
              label="Começar"
              onPress={() => router.push("/login")}
            />
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
