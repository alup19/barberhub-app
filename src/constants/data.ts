export const services = [
  { id: "1", name: "Corte", description: "Corte rápido e moderno", price: 45, duration: 30, category: "Cabelo", icon: "cut", popular: true },
  { id: "2", name: "Barba", description: "Aparar e modelar barba", price: 35, duration: 20, category: "Barba", icon: "sparkles", popular: false },
  { id: "3", name: "Corte + Barba", description: "Combo completo com desconto", price: 70, duration: 50, category: "Cabelo", popular: true, icon: "cut" },
  { id: "4", name: "Platinado", description: "Fios com visual premium", price: 120, duration: 90, category: "Tratamento", icon: "flame", popular: false },
] as const;

export const barbers = [
  { id: "b1", initials: "C", name: "Carlos", role: "Master Barber", rating: "4.9", reviews: 120, available: true },
  { id: "b2", initials: "R", name: "Rafael", role: "Senior Barber", rating: "4.8", reviews: 94, available: true },
  { id: "b3", initials: "D", name: "Diego", role: "Barber", rating: "4.7", reviews: 72, available: false },
] as const;

export const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:30", available: true },
  { time: "12:00", available: false },
  { time: "14:00", available: true },
  { time: "15:30", available: true },
  { time: "17:00", available: false },
] as const;

export type AppointmentStatus = "Agendado" | "Concluído" | "Cancelado";

export const appointments: ReadonlyArray<{ readonly id: string; readonly initials: string; readonly service: string; readonly barber: string; readonly date: string; readonly time: string; readonly duration: number; readonly price: number; readonly status: AppointmentStatus }> = [
  { id: "a1", initials: "C", service: "Corte + Barba", barber: "Carlos", date: "10/05/2026", time: "10:30", duration: 50, price: 70, status: "Agendado" },
  { id: "a2", initials: "R", service: "Barba", barber: "Rafael", date: "25/04/2026", time: "15:00", duration: 20, price: 35, status: "Concluído" },
];

export type Service = (typeof services)[number];
export type Barber = (typeof barbers)[number];
export type Appointment = (typeof appointments)[number];
