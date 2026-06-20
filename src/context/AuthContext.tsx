import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  admin: boolean;
  token: string;
  barbeariaId: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchComAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca a única barbearia cadastrada no sistema (modelo de app single-tenant)
  async function buscarBarbeariaUnica(): Promise<string | null> {
    try {
      const res = await fetch(`${apiUrl}/barbearias`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data) || data.length === 0) return null;
      return String(data[0].id);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function carregar() {
      const salvo = await AsyncStorage.getItem("@usuario");
      if (salvo) {
        let usuarioCarregado = JSON.parse(salvo);

        // Corrige usuários antigos salvos sem barbeariaId
        if (!usuarioCarregado.barbeariaId) {
          const barbeariaId = await buscarBarbeariaUnica();
          if (barbeariaId) {
            usuarioCarregado = { ...usuarioCarregado, barbeariaId };
            await AsyncStorage.setItem("@usuario", JSON.stringify(usuarioCarregado));
          }
        }

        setUsuario(usuarioCarregado);
      }
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

    // Se o usuário não vem com barbeariaId (caso de cliente comum),
    // busca a barbearia única do app e injeta no objeto local
    let usuarioFinal = data;
    if (!data.barbeariaId) {
      const barbeariaId = await buscarBarbeariaUnica();
      if (barbeariaId) {
        usuarioFinal = { ...data, barbeariaId };
      }
    }

    await AsyncStorage.setItem("@usuario", JSON.stringify(usuarioFinal));
    setUsuario(usuarioFinal);
  }

  async function logout() {
    await AsyncStorage.removeItem("@usuario");
    setUsuario(null);
  }

  async function fetchComAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${usuario?.token}`,
      },
    });

    if (response.status === 401) {
      await logout();
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    return response;
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, fetchComAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);