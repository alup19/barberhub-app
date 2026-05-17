import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Usuario = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  admin: boolean;
  token: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const salvo = await AsyncStorage.getItem("@usuario");
      if (salvo) setUsuario(JSON.parse(salvo));
      setLoading(false);
    }
    carregar();
  }, []);

  async function login(email: string, senha: string) {
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.erro || "Erro ao fazer login");

    await AsyncStorage.setItem("@usuario", JSON.stringify(data));
    setUsuario(data);
  }

  async function logout() {
    await AsyncStorage.removeItem("@usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);