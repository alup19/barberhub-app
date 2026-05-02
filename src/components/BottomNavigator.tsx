import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type TabKey = "home" | "servicos" | "agendamentos" | "perfil";

type TabRoute = "/home" | "/servicos" | "/agendamentos" | "/perfil";

type TabItem = {
    key: TabKey;
    label: string;
    icon: string;
    route: TabRoute;
};

const tabs: TabItem[] = [
    { key: "home", label: "Início", icon: "home-outline", route: "/home" },
    { key: "servicos", label: "Serviços", icon: "grid-outline", route: "/servicos" },
    { key: "agendamentos", label: "Agenda", icon: "calendar-outline", route: "/agendamentos" },
    { key: "perfil", label: "Perfil", icon: "person-outline", route: "/perfil" },
];

const activeColor = "#CC8F33";
const inactiveColor = "#988C81";
const buttonGradientColors = ["#CC8F33", "#c79a3e", "#e2b558"] as const;

function renderTab(tab: TabItem, isActive: boolean) {
    return (
        <Pressable
            key={tab.key}
            onPress={() => !isActive && router.push(tab.route)}
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
}

export function BottomNavigator({ active }: { active: TabKey }) {
    return (
        <View className="flex-row items-end justify-around pt-2 pb-2 px-4 border-t border-[#988C81]/20">
            {tabs.slice(0, 2).map((tab) => renderTab(tab, tab.key === active))}

            <View className="flex-1 items-center -mt-6">
                <Pressable
                    onPress={() => router.push("/reserva/passo1")}
                    style={{
                        shadowColor: "#e2b558",
                        shadowOpacity: 0.5,
                        shadowRadius: 14,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 10,
                    }}
                    className="w-14 h-14 rounded-full overflow-hidden items-center justify-center"
                >
                    <LinearGradient
                        colors={buttonGradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 56, height: 56, borderRadius: 28 }}
                        className="items-center justify-center"
                    >
                        <Ionicons name="add" size={28} color="#0a0805" />
                    </LinearGradient>
                </Pressable>
                <Text className="text-[11px] mt-1 font-semibold" style={{ color: activeColor }}>
                    Agendar
                </Text>
            </View>

            {tabs.slice(2).map((tab) => renderTab(tab, tab.key === active))}
        </View>
    );
}
