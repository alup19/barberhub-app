import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarberRow } from "../../components/BarberRow";
import { BottomNavigator } from "../../components/BottomNavigator";
import { ServiceCard } from "../../components/ServiceCard";
import { services as allServices, barbers } from "../../constants/data";

const GRADIENT_COLORS = ["#CC8F33", "#c79a3e", "#e2b558"] as const;

type ServiceItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  price: string;
  duration: string;
  popular?: boolean;
};

type BarberProfile = {
  initial: string;
  name: string;
  role: string;
  rating: string;
};

const services: ServiceItem[] = allServices.slice(0, 4).map((item) => ({
  icon: `${item.icon}-outline` as const,
  title: item.name,
  price: String(item.price),
  duration: `${item.duration} min`,
  popular: !!item.popular,
}));

const homeBarbers: BarberProfile[] = barbers.slice(0, 3).map((item) => ({
  initial: item.initials,
  name: item.name,
  role: item.role,
  rating: item.rating,
}));

const serviceRows = [services.slice(0, 2), services.slice(2, 4)];

export default function Home() {
  return (
    <View className="flex-1 bg-bg bg-[#110F0E] pt-10">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          className="pb-2"
        >
          <View className="px-6 pt-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-text-muted text-[#988C81] text-base">Bem-vindo 👋</Text>
              <Text className="text-text text-white text-3xl mt-1">João Silva</Text>
            </View>

            <Pressable className="w-11 h-11 rounded-full bg-bg-card items-center justify-center mr-3 border bg-[#292623] border-white/5">
              <Ionicons name="notifications-outline" size={20} color="#f5ecd9" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
            </Pressable>

            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#0a0805", fontWeight: "bold" }}>JS</Text>
            </LinearGradient>
          </View>

          <View className="px-6 mt-6">
            <View className="flex-row items-center bg-bg-card rounded-2xl px-4 h-12 border bg-[#292623] border-white/5">
              <Ionicons name="search" size={18} color="#988C81" />
              <TextInput
                placeholder="Buscar serviços..."
                placeholderTextColor="#988C81"
                className="flex-1 text-text text-white ml-3"
              />
            </View>
          </View>

          <View className="px-6 mt-6">
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 20 }}
            >
              <Text className="text-[#110F0E]/70 text-xs font-bold tracking-widest">OFERTA ESPECIAL</Text>
              <Text className="font-serif text-[#110F0E] text-3xl mt-2">20% OFF</Text>
              <Text className="text-[#110F0E]/80 text-sm mt-1">No primeiro agendamento</Text>
              <Pressable onPress={() => router.push("/booking/step1")} className="bg-[#110F0E] self-start mt-4 rounded-xl px-4 py-2.5">
                <Text className="text-[#CC8F33] font-semibold text-sm">Agendar agora</Text>
              </Pressable>
            </LinearGradient>
          </View>

          <View className="px-6 mt-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-text text-white text-2xl">Serviços</Text>
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-[#CC8F33] text-sm font-semibold">Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#CC8F33" />
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {serviceRows.map((row, index) => (
                <View key={index} className="flex-row gap-3">
                  {row.map((service) => (
                    <ServiceCard key={service.title} {...service} />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View className="px-6 mt-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-text text-white text-2xl">Barbeiros</Text>
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-[#CC8F33] text-sm font-semibold">Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#CC8F33" />
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {homeBarbers.map((barber) => (
                <BarberRow key={barber.name} {...barber} />
              ))}
            </View>
          </View>

          <View className="px-6 mt-6">
            <View className="flex-row items-center bg-bg-card bg-[#1C1A17] rounded-2xl p-4 border border-white/5">
              <View className="w-10 h-10 rounded-xl bg-[#4d36149f] items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#e2b558" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-text text-white font-semibold">Barber Premium</Text>
                <Text className="text-text-muted text-[#988C81] text-xs mt-0.5">Rua das Flores, 123 - Centro</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#a89a7e" />
            </View>
          </View>
        </ScrollView>

        <BottomNavigator active="home" />
      </SafeAreaView>
    </View>
  );
}
