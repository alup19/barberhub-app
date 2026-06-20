import React, { createContext, useContext, useState, ReactNode } from "react";

export type Barbeiro = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  anosExp: number;
  funcao: string;
  ativo: boolean;
};

export type Servico = {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  duracaoMin: number;
  categoria: string;
  ativo: boolean;
};

type BookingState = {
  barber: Barbeiro | null;
  service: Servico | null;
  date: string | null;
  time: string | null;
};

type BookingContextValue = BookingState & {
  setBarber: (b: Barbeiro | null) => void;
  setService: (s: Servico | null) => void;
  setDate: (d: string | null) => void;
  setTime: (t: string | null) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [barber, setBarber] = useState<Barbeiro | null>(null);
  const [service, setService] = useState<Servico | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const reset = () => {
    setBarber(null);
    setService(null);
    setDate(null);
    setTime(null);
  };

  return (
    <BookingContext.Provider value={{ barber, service, date, time, setBarber, setService, setDate, setTime, reset }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}