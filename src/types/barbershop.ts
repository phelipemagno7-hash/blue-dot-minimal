export type ServiceCategory = "cabelo" | "barba" | "combo" | "tratamento" | "outros";

export interface BarberService {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
  iconName?: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  specialties: string[];
  workingDays: number[]; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
  workingHours: {
    start: string; // "09:00"
    end: string;   // "20:00"
  };
}

export type AppointmentStatus = "confirmed" | "in_progress" | "completed" | "cancelled";
export type PaymentMethod = "local" | "pix";

export interface Appointment {
  id: string;
  code: string; // Ex: #BARB-8492
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
  barberId: string; // Barber ID or 'any'
  services: BarberService[];
  date: string; // YYYY-MM-DD
  timeSlot: string; // "14:30"
  totalPrice: number;
  totalDurationMinutes: number;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  barberId: string;
  date: string;
  timeSlot: string;
  reason: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  barberName: string;
  avatar?: string;
}

export interface BarbershopInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  openingHoursWeekdays: string;
  openingHoursSaturday: string;
  openingHoursSunday: string;
  rating: number;
  totalReviews: number;
}
