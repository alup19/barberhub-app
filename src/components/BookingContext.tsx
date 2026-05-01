import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Barber, Service } from "../constants/data";

type BookingState = {
  barber: Barber | null;
  service: Service | null;
  date: string | null;
  time: string | null;
};

type BookingContextValue = BookingState & {
  setBarber: (b: Barber | null) => void;
  setService: (s: Service | null) => void;
  setDate: (d: string | null) => void;
  setTime: (t: string | null) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
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
