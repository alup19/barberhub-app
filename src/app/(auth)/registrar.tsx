import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoldButton } from "../../components/GoldButton";
import Toast from "react-native-toast-message";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Criterio = {
  label: string;
  ok: boolean;
};

function validaCriterios(senha: string): Criterio[] {
  return [
    { label: "Mínimo 8 caracteres", ok: senha.length >= 8 },
    { label: "Letra minúscula", ok: /[a-z]/.test(senha) },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(senha) },
    { label: "Número", ok: /[0-9]/.test(senha) },
    { label: "Símbolo (!@#$...)", ok: /[^a-zA-Z0-9]/.test(senha) },
  ];
}

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [senhaFocada, setSenhaFocada] = useState(false);

  const criterios = validaCriterios(senha);
  const senhaValida = criterios.every((c) => c.ok);
  const totalOk = criterios.filter((c) => c.ok).length;

  const forcaCor =
    totalOk <= 1 ? "#E5484D" :
    totalOk <= 3 ? "#CC8F33" :
    "#22C55E";

  async function handleCadastro() {
    if (!nome || !email || !telefone || !senha) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Preencha todos os campos."
      });
      return;
    }
    if (!senhaValida) {
      Toast.show({
        type: "error",
        text1: "Senha fraca",
        text2: "Verifique os requisitos da senha."
      });
      return;
    }

    try {
      setCarregando(true);
      const res = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone , senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        const erros = Array.isArray(data.erro) ? data.erro.join("\n") : data.erro;
        Toast.show({
          type: "error",
          text1: "Erro no cadastro",
          text2: erros || "Não foi possível criar a conta."
        });
        return;
      }

      router.replace("/login");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível conectar ao servidor."
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#110F0E]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-14">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-start justify-center">
            <Ionicons name="arrow-back" size={24} color="#a89a7e" />
          </Pressable>

          <View className="flex-row items-center gap-3 mt-4">
            <Image
              source={require("../../../assets/images/tesoura.png")}
              style={{ width: 42, height: 42, borderRadius: 60 }}
            />
            <Text className="text-[#c79a3e] text-xl tracking-widest">BARBER</Text>
          </View>

          <Text className="text-white text-4xl mt-6">Criar conta</Text>
          <Text className="text-[#988C81] text-sm mt-2">Preencha seus dados para começar</Text>

          <View className="mt-8 gap-4">
            <View className="flex-row items-center bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
              <Ionicons name="person-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Nome completo"
                placeholderTextColor="#988C81"
                autoCapitalize="words"
                value={nome}
                onChangeText={setNome}
                className="flex-1 text-white ml-3 text-base"
              />
            </View>

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
              <Ionicons name="call-outline" size={20} color="#988C81" />
              <TextInput
                placeholder="Telefone"
                placeholderTextColor="#988C81"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
                maxLength={15}
                className="flex-1 text-white ml-3 text-base"
              />
            </View>

            <View>
              <View className="flex-row items-center bg-[#292623] rounded-2xl px-4 h-14 border border-white/5">
                <Ionicons name="lock-closed-outline" size={20} color="#988C81" />
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#988C81"
                  secureTextEntry={!showPwd}
                  value={senha}
                  onChangeText={setSenha}
                  onFocus={() => setSenhaFocada(true)}
                  className="flex-1 text-white ml-3 text-base"
                />
                <Pressable onPress={() => setShowPwd((v) => !v)}>
                  <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} color="#988C81" />
                </Pressable>
              </View>

              {(senhaFocada || senha.length > 0) && (
                <View className="mt-3 bg-[#292623] border border-[#3A3A3A] rounded-2xl p-4">
                  <View className="flex-row gap-1 mb-3">
                    {criterios.map((c, i) => (
                      <View
                        key={i}
                        style={{ backgroundColor: i < totalOk ? forcaCor : "#2A2A2A" }}
                        className="flex-1 h-1 rounded-full"
                      />
                    ))}
                  </View>

                  <Text style={{ color: forcaCor }} className="text-xs font-semibold mb-2">
                    {totalOk <= 1 ? "Senha fraca" : totalOk <= 3 ? "Senha média" : "Senha forte"}
                  </Text>

                  {criterios.map((c, i) => (
                    <View key={i} className="flex-row items-center gap-2 mb-1.5">
                      <Ionicons
                        name={c.ok ? "checkmark-circle" : "ellipse-outline"}
                        size={15}
                        color={c.ok ? "#22C55E" : "#3A3A3A"}
                      />
                      <Text style={{ color: c.ok ? "#C5C1B9" : "#555" }} className="text-xs">
                        {c.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className="mt-6">
            <GoldButton
              label={carregando ? "Criando conta..." : "Criar conta"}
              onPress={handleCadastro}
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
          <Pressable onPress={() => router.push("/login")}>
            <Text className="text-[#988C81] text-sm">
              Já tem conta? <Text className="text-[#CC8F33] font-semibold">Entrar</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}