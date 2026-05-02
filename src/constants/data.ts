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

export const userAppointments: readonly { readonly id: string; readonly initials: string; readonly service: string; readonly barber: string; readonly date: string; readonly time: string; readonly duration: number; readonly price: number; readonly status: AppointmentStatus }[] = [
  { id: "a1", initials: "C", service: "Corte + Barba", barber: "Carlos", date: "10/05/2026", time: "10:30", duration: 50, price: 70, status: "Agendado" },
  { id: "a2", initials: "R", service: "Barba", barber: "Rafael", date: "25/04/2026", time: "15:00", duration: 20, price: 35, status: "Concluído" },
];

export type Service = (typeof services)[number];
export type Barber = (typeof barbers)[number];
export type UserAppointment = (typeof userAppointments)[number];

// Admin data
export type AdminAppointment = {
  id: string;
  time: string;
  duration: string;
  initial: string;
  name: string;
  service: string;
  status: "Pendente" | "Próximo" | "Cancelado";
};

export type TeamMember = {
  id: string;
  initial: string;
  name: string;
  years: string;
  cuts: number;
  rating: string;
  today: number | string;
  status: "Barbeiro" | "Folga";
  online: boolean;
  schedule: string;
};

export type AdminService = {
  id: string;
  icon: keyof typeof import("@expo/vector-icons/build/Ionicons").glyphMap;
  name: string;
  time: string;
  price: string;
  tag: "PREMIUM" | null;
  active: boolean;
};

export const adminAppointments: AdminAppointment[] = [
  { id: "1", time: "10:00", duration: "30 min", initial: "R", name: "Rafael Costa", service: "Corte Simples · Pedro", status: "Pendente" },
  { id: "2", time: "11:30", duration: "60 min", initial: "L", name: "Lucas Ferreira", service: "Corte + Barba · Sobrancelha · João", status: "Próximo" },
  { id: "3", time: "13:00", duration: "30 min", initial: "A", name: "André Santos", service: "Corte Simples · Pedro", status: "Cancelado" },
  { id: "4", time: "14:30", duration: "45 min", initial: "G", name: "Gabriel Nunes", service: "Corte + Barba · João", status: "Pendente" },
];

export const team: TeamMember[] = [
  { id: "1", initial: "C", name: "Carlos Silva", years: "8 anos", cuts: 98, rating: "4.7", today: 2, status: "Barbeiro", online: true, schedule: "Ter–Dom · 10h às 18h" },
  { id: "2", initial: "M", name: "Miguel Alves", years: "3 anos", cuts: 54, rating: "4.5", today: "—", status: "Folga", online: false, schedule: "Quarta, 9 de Abril" },
  { id: "3", initial: "F", name: "Fernando Alves", years: "1 ano", cuts: 54, rating: "4.5", today: "—", status: "Folga", online: false, schedule: "Quarta, 9 de Abril" },
];

export const adminServices: AdminService[] = [
  { id: "1", icon: "cut-outline", name: "Corte + Barba", time: "45 min · Combo", price: "R$55", tag: null, active: true },
  { id: "2", icon: "chevron-down-circle-outline", name: "Barba", time: "20 min", price: "R$25", tag: null, active: true },
  { id: "3", icon: "ellipse-outline", name: "Sobrancelha", time: "15 min", price: "R$15", tag: null, active: true },
  { id: "4", icon: "star-outline", name: "Experiência Premium", time: "90 min · Corte + Barba + Toalha Quente", price: "R$95", tag: "PREMIUM", active: true },
  { id: "5", icon: "arrow-forward-outline", name: "Relaxamento Couro Cabeludo", time: "60 min · Desativado", price: "R$70", tag: null, active: false },
];

export const categories = ["Todos", "Cortes", "Barba", "Estética", "Premium"];
export const adminBarbers = ["João", "Pedro", "Miguel"];
export const serviceOptions = ["Corte Simples", "Corte + Barba", "Barba", "Sobrancelha"];
