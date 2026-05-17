import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoldButton } from "../../components/GoldButton";
import { useAuth } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Preencha e-mail e senha."
      });
      return;
    }
    try {
      setCarregando(true);
      await login(email.trim(), senha);
      router.replace("/home");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message || "Login ou senha incorretos"
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-14">
          <Pressable onPress={() => router.replace("/")} className="w-10 h-10 items-start justify-center">
            <Ionicons name="arrow-back" size={24} color="#a89a7e" />
          </Pressable>

          <View className="flex-row items-center gap-3 mt-4">
            <Image
              source={require("../../../assets/images/tesoura.png")}
              style={{ width: 42, height: 42, borderRadius: 60 }}
            />
            <Text className="text-[#c79a3e] text-xl tracking-widest">BARBER</Text>
          </View>

          <Text className="text-white text-4xl mt-6">Bem-vindo de volta</Text>
          <Text className="text-[#988C81] text-sm mt-2">Entre na sua conta para agendar</Text>

          <View className="mt-8 gap-4">
            <View className="flex-row items-center bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
              <Ionicons name="mail-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#988C81"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-white ml-3 text-base"
              />
            </View>

            <View className="flex-row items-center bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
              <Ionicons name="lock-closed-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#988C81"
                secureTextEntry={!showPwd}
                value={senha}
                onChangeText={setSenha}
                className="flex-1 text-white ml-3 text-base"
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
            <GoldButton
              label={carregando ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              disabled={carregando}
            />
          </View>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-[#988C81] text-xs mx-3">ou continue com</Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-[#292623] border border-white/5 rounded-2xl h-14 flex-row items-center justify-center gap-2">
              <AntDesign name="google" size={18} color="#f5ecd9" />
              <Text className="text-white font-semibold">Google</Text>
            </Pressable>
            <Pressable className="flex-1 bg-[#292623] border border-white/5 rounded-2xl h-14 flex-row items-center justify-center gap-2">
              <AntDesign name="apple" size={18} color="#f5ecd9" />
              <Text className="text-white font-semibold">Apple</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1" />

        <View className="items-center pt-10 pb-14">
          <Pressable onPress={() => router.push("/registrar")}>
            <Text className="text-[#988C81] text-sm">
              Não tem conta? <Text className="text-[#CC8F33] font-semibold">Criar conta</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}