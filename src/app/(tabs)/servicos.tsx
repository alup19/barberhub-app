import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigator } from "../../components/BottomNavigator";
import { services } from "../../constants/data";

const categories = ["Todos", "Cabelo", "Barba", "Tratamento"] as const;
type Cat = typeof categories[number];

const iconMap = { cut: "cut-outline", sparkles: "sparkles-outline", drop: "water-outline", flame: "flame-outline" } as const;

export default function Services() {
  const [cat, setCat] = useState<Cat>("Todos");
  const list = cat === "Todos" ? services : services.filter((s) => s.category === cat);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <Text className="text-3xl text-white mt-2 mx-5" style={{ fontFamily: "serif" }}>
        Serviços
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 max-h-12" contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {categories.map((c) => {
          const active = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              className={`px-5 h-10 rounded-full items-center justify-center ${active ? "bg-gold" : "bg-bg-card border border-line"}`}
            >
              <Text className={`${active ? "text-bg font-bold" : "text-muted"}`}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView className="mt-4" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}>
        {list.map((s) => (
          <View key={s.id} className="bg-bg-card rounded-2xl p-4 flex-row items-center border border-line">
            <View className="w-12 h-12 rounded-xl bg-gold/15 items-center justify-center mr-3">
              <Ionicons name={iconMap[s.icon] as any} size={22} color="#d4a24c" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold flex-1">{s.name}</Text>
                {s.popular && (
                  <View className="bg-gold/20 px-2 py-0.5 rounded-full">
                    <Text className="text-gold text-xs font-semibold">Popular</Text>
                  </View>
                )}
              </View>
              <Text className="text-muted text-xs mt-1">{s.description}</Text>
              <View className="flex-row items-center mt-2 gap-3">
                <Text className="text-gold font-bold">R$ {s.price}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={12} color="#9a9a9a" />
                  <Text className="text-muted text-xs ml-1">{s.duration} min</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9a9a9a" />
          </View>
        ))}
      </ScrollView>
      <BottomNavigator active="services" />
    </SafeAreaView>
  );
}
