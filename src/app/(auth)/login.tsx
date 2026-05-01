import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoldButton } from "../../components/GoldButton";

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-bg bg-[#110F0E]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-14">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-start justify-center">
            <Ionicons name="arrow-back" size={24} color="#a89a7e" />
          </Pressable>

          <View className="flex-row items-center gap-3 mt-4">
            <Image
              source={require("../../../assets/images/tesoura.png")}
              style={{
                width: 42,
                height: 42,
                borderRadius: 60,
              }}
            />
            <Text className="text-text-muted text-[#c79a3e] text-xl tracking-widest">BARBER</Text>
          </View>

          <Text className="text-text-muted text-white text-4xl mt-6">Bem-vindo de volta</Text>
          <Text className="text-text-muted text-[#988C81] text-sm mt-2">Entre na sua conta para agendar</Text>

          <View className="mt-8 gap-4">
            <View className="flex-row items-center bg-bg-input bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
              <Ionicons name="mail-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#988C81"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-text text-[#988C81] ml-3 text-base"
              />
            </View>

            <View className="flex-row items-center bg-bg-input bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
              <Ionicons name="lock-closed-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#988C81"
                secureTextEntry={!showPwd}
                className="flex-1 text-text text-[#988C81] ml-3 text-base"
              />
              <Pressable onPress={() => setShowPwd((v) => !v)}>
                <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} color="#988C81" />
              </Pressable>
            </View>
          </View>

          <Pressable className="mt-4">
            <Text className="text-[#CC8F33] text-sm font-semibold">Esqueceu a senha?</Text>
          </Pressable>

          <View className="mt-6">
            <GoldButton label="Entrar" onPress={() => router.replace("/home")} />
          </View>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-text-dim text-[#988C81] text-xs mx-3">ou continue com</Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-bg-input bg-[#292623] border border-white/5 rounded-2xl h-14 flex-row items-center justify-center gap-2">
              <AntDesign name="google" size={18} color="#f5ecd9" />
              <Text className="text-text text-white font-semibold">Google</Text>
            </Pressable>
            <Pressable className="flex-1 bg-bg-input bg-[#292623] border border-white/5 rounded-2xl h-14 flex-row items-center justify-center gap-2">
              <AntDesign name="apple" size={18} color="#f5ecd9" />
              <Text className="text-text text-white font-semibold">Apple</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1" />

        <View className="items-center pt-10 pb-14">
          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-text-muted text-[#988C81] text-sm">
              Não tem conta? <Text className="text-[#CC8F33] font-semibold">Criar conta</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
