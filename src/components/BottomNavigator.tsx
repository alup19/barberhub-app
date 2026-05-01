import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

type TabKey = "home" | "services" | "appointments" | "profile";

type TabRoute = "/home" | "/services" | "/appointments" | "/profile";

const tabs: Array<{ key: TabKey; label: string; icon: string; route: TabRoute }> = [
  { key: "home", label: "Início", icon: "home-outline", route: "/home" },
  { key: "services", label: "Serviços", icon: "grid-outline", route: "/services" },
  { key: "appointments", label: "Agendamentos", icon: "calendar-outline", route: "/appointments" },
  { key: "profile", label: "Perfil", icon: "person-outline", route: "/profile" },
];

export function BottomNavigator({ active }: { active: TabKey }) {
  const activeColor = "#CC8F33";
  const inactiveColor = "#988C81";

  return (
    <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 bg-bg-card border-t border-white/5">
      <View className="flex-row items-end justify-around pt-2 pb-1 px-4 border-t border-[#988C81]/20">
        {tabs.slice(0, 2).map((tab) => {
          const isActive = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={() => router.push(tab.route)}
              className="items-center py-2 flex-1"
            >
              <Ionicons name={tab.icon as any} size={22} color={isActive ? activeColor : inactiveColor} />
              <Text
                className="text-[11px] mt-1"
                style={{ color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? "700" : "400" }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}

        <View className="flex-1 items-center -mt-6">
          <Pressable
            onPress={() => router.push("/booking/step1")}
            style={{
              shadowColor: "#e2b558",
              shadowOpacity: 0.5,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 4 },
              elevation: 10,
            }}
            className="w-14 h-14 rounded-full items-center justify-center"
          >
            <LinearGradient
              colors={["#CC8F33", "#c79a3e", "#e2b558"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-full h-full rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={28} color="#0a0805" />
            </LinearGradient>
          </Pressable>
          <Text
            className="text-[11px] mt-1 font-semibold"
            style={{ color: "#CC8F33" }}
          >
            Agendar
          </Text>
        </View>

        {tabs.slice(2).map((tab) => {
          const isActive = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={() => router.push(tab.route)}
              className="items-center py-2 flex-1"
            >
              <Ionicons name={tab.icon as any} size={22} color={isActive ? activeColor : inactiveColor} />
              <Text
                className="text-[11px] mt-1"
                style={{ color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? "700" : "400" }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
