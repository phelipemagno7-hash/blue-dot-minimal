import { Barber, BarberService, BarbershopInfo, Review, Appointment } from "../types/barbershop";

export const BARBERSHOP_INFO: BarbershopInfo = {
  name: "Navalha de Ouro",
  tagline: "Tradição, Estilo e Atendimento Premium",
  address: "Av. Paulista, 1578 - Cerqueira César",
  city: "São Paulo - SP",
  phone: "(11) 3456-7890",
  whatsapp: "5511999998888",
  instagram: "@barbearianavalhadeouro",
  openingHoursWeekdays: "Terça a Sexta: 09:00 às 20:00",
  openingHoursSaturday: "Sábado: 08:30 às 19:00",
  openingHoursSunday: "Domingo e Segunda: Fechado",
  rating: 4.9,
  totalReviews: 248,
};

export const INITIAL_SERVICES: BarberService[] = [
  {
    id: "serv-corte-degrade",
    name: "Corte Degradê / Fade Moderno",
    category: "cabelo",
    price: 50.0,
    durationMinutes: 40,
    description: "Corte estilizado com técnicas de degradê (Low, Mid, High ou Taper Fade), acabamento com navalha e finalização com pomada premium.",
    popular: true,
  },
  {
    id: "serv-corte-classico",
    name: "Corte Clássico / Social",
    category: "cabelo",
    price: 45.0,
    durationMinutes: 35,
    description: "Corte tradicional na tesoura ou máquina, alinhamento perfeito, lavagem com shampoo refrescante e penteado.",
    popular: false,
  },
  {
    id: "serv-barboterapia",
    name: "Barba Terapia com Toalha Quente",
    category: "barba",
    price: 45.0,
    durationMinutes: 35,
    description: "Ritual completo com toalha quente, óleos essenciais, massagem facial revigorante, navalhete descartável e bálsamo pós-barba.",
    popular: true,
  },
  {
    id: "serv-barba-express",
    name: "Barba Express / Alinhamento",
    category: "barba",
    price: 30.0,
    durationMinutes: 20,
    description: "Aparo de volume com máquina, contorno rápido na navalha e hidratação com óleo perfumado.",
    popular: false,
  },
  {
    id: "serv-combo-vip",
    name: "Combo VIP (Corte + Barboterapia)",
    category: "combo",
    price: 85.0,
    durationMinutes: 70,
    description: "A experiência completa da barbearia! Corte a sua escolha + Barba com toalha quente + Lavagem especial + Cerveja ou café de cortesia.",
    popular: true,
  },
  {
    id: "serv-combo-completo",
    name: "Combo Master (Corte + Barba + Sobrancelha)",
    category: "combo",
    price: 100.0,
    durationMinutes: 80,
    description: "Visual renovado por inteiro: corte, barba completa com toalha quente e alinhamento milimétrico da sobrancelha na navalha.",
    popular: true,
  },
  {
    id: "serv-platinado",
    name: "Platinado Global / Nevou",
    category: "tratamento",
    price: 130.0,
    durationMinutes: 120,
    description: "Descoloração profissional de alta precisão com produtos que protegem a fibra capilar e matização no tom desejado.",
    popular: false,
  },
  {
    id: "serv-pigmentacao",
    name: "Pigmentação de Cabelo / Barba",
    category: "tratamento",
    price: 35.0,
    durationMinutes: 25,
    description: "Correção de falhas e disfarce dos fios brancos com efeito sombreado natural de alta durabilidade.",
    popular: false,
  },
  {
    id: "serv-sobrancelha",
    name: "Sobrancelha na Navalha",
    category: "outros",
    price: 20.0,
    durationMinutes: 15,
    description: "Limpeza, alinhamento e desenho da sobrancelha mantendo traços masculinos naturais.",
    popular: false,
  },
  {
    id: "serv-corte-kids",
    name: "Corte Infantil (Até 12 anos)",
    category: "cabelo",
    price: 40.0,
    durationMinutes: 30,
    description: "Atendimento paciente e especializado para crianças em cadeira adaptada com tema divertido.",
    popular: false,
  },
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: "barber-carlos",
    name: "Carlos 'Navalha' Silva",
    role: "Master Barber & Fundador",
    avatar: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 142,
    bio: "Mais de 12 anos de experiência. Especialista em cortes clássicos na tesoura, barboterapia tradicional e visagismo.",
    specialties: ["Cortes Clássicos", "Barboterapia", "Visagismo"],
    workingDays: [2, 3, 4, 5, 6], // Terça a Sábado
    workingHours: { start: "09:00", end: "20:00" },
  },
  {
    id: "barber-marcos",
    name: "Marcos 'Fade Master' Santos",
    role: "Especialista em Degradê & Freestyle",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 98,
    bio: "Referência em cortes modernos, fade perfeito, desenhos freestyle e tendências urbanas internacionais.",
    specialties: ["Degradê / Fade", "Freestyle", "Pigmentação"],
    workingDays: [2, 3, 4, 5, 6],
    workingHours: { start: "09:00", end: "20:00" },
  },
  {
    id: "barber-rafael",
    name: "Rafael 'Viking' Oliveira",
    role: "Especialista em Barbas & Tratamentos",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 84,
    bio: "Especialista em barbas longas, alinhamentos complexos, descoloração, platinados e reconstrução capilar.",
    specialties: ["Barba Longa", "Platinado / Nevou", "Selagem"],
    workingDays: [2, 3, 4, 5, 6],
    workingHours: { start: "10:00", end: "20:00" },
  },
  {
    id: "barber-diego",
    name: "Diego 'Style' Costa",
    role: "Barbeiro & Colorimetrista",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 65,
    bio: "Estilo jovial e dinâmico, mestre em cortes texturizados, corte infantil e finalizações personalizadas.",
    specialties: ["Texturizados", "Corte Infantil", "Luzes / Mechas"],
    workingDays: [2, 3, 4, 5, 6],
    workingHours: { start: "09:00", end: "19:00" },
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Gabriel Mendonça",
    rating: 5,
    date: "Há 2 dias",
    comment: "Ambiente sensacional, atendimento impecável do Carlos! A toalha quente na barba é relaxamento puro.",
    service: "Combo VIP",
    barberName: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "rev-2",
    author: "Lucas Ferreira",
    rating: 5,
    date: "Há 4 dias",
    comment: "Melhor fade de SP! O Marcos tem uma mão muito firme e o degradê fica perfeito por semanas.",
    service: "Corte Degradê",
    barberName: "Marcos Santos",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "rev-3",
    author: "Rodrigo Alencar",
    rating: 5,
    date: "Há 1 semana",
    comment: "Pontualidade britânica e um cafezinho expresso de primeira enquanto aguarda. Recomendo de olhos fechados.",
    service: "Barboterapia",
    barberName: "Rafael Oliveira",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
  },
];

// Helper to get formatted today date YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "app-101",
    code: "#NB-4819",
    customerName: "Eduardo Camargo",
    customerPhone: "(11) 98765-4321",
    customerEmail: "eduardo@email.com",
    barberId: "barber-carlos",
    services: [INITIAL_SERVICES[4]], // Combo VIP
    date: getTodayDateString(),
    timeSlot: "10:00",
    totalPrice: 85.0,
    totalDurationMinutes: 70,
    status: "confirmed",
    paymentMethod: "pix",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-102",
    code: "#NB-9234",
    customerName: "Felipe Andrade",
    customerPhone: "(11) 97654-3210",
    barberId: "barber-marcos",
    services: [INITIAL_SERVICES[0]], // Degradê
    date: getTodayDateString(),
    timeSlot: "11:30",
    totalPrice: 50.0,
    totalDurationMinutes: 40,
    status: "in_progress",
    paymentMethod: "local",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-103",
    code: "#NB-3158",
    customerName: "Bruno Henrique",
    customerPhone: "(11) 96543-2109",
    barberId: "barber-rafael",
    services: [INITIAL_SERVICES[2]], // Barboterapia
    date: getTodayDateString(),
    timeSlot: "14:00",
    totalPrice: 45.0,
    totalDurationMinutes: 35,
    status: "confirmed",
    paymentMethod: "local",
    createdAt: new Date().toISOString(),
  },
];

export const AVAILABLE_TIME_SLOTS = [
  "09:00", "09:40", "10:20", "11:00", "11:40",
  "13:00", "13:40", "14:20", "15:00", "15:40",
  "16:20", "17:00", "17:40", "18:20", "19:00", "19:40"
];
