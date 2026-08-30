import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Barber,
  BarberService,
  Appointment,
  AppointmentStatus,
  BlockedSlot,
  Review,
  BarbershopInfo,
} from "../types/barbershop";
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  BARBERSHOP_INFO,
  AVAILABLE_TIME_SLOTS,
} from "../data/mockData";

interface CreateAppointmentInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
  barberId: string;
  services: BarberService[];
  date: string;
  timeSlot: string;
  paymentMethod: "local" | "pix";
}

interface BarbershopContextType {
  services: BarberService[];
  barbers: Barber[];
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  reviews: Review[];
  info: BarbershopInfo;
  activeView: "client" | "admin";
  setActiveView: (view: "client" | "admin") => void;
  myAppointmentsModalOpen: boolean;
  setMyAppointmentsModalOpen: (open: boolean) => void;
  bookingWizardOpen: boolean;
  setBookingWizardOpen: (open: boolean) => void;
  lastCreatedAppointment: Appointment | null;
  setLastCreatedAppointment: (app: Appointment | null) => void;
  selectedServiceForBooking: BarberService | null;
  setSelectedServiceForBooking: (service: BarberService | null) => void;
  
  // Actions
  createAppointment: (input: CreateAppointmentInput) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  blockTimeSlot: (barberId: string, date: string, timeSlot: string, reason: string) => void;
  unblockTimeSlot: (id: string) => void;
  isSlotAvailable: (barberId: string, date: string, timeSlot: string) => boolean;
  getAppointmentsForDate: (date: string, barberId?: string) => Appointment[];
  getAppointmentsByPhone: (phone: string) => Appointment[];
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  APPOINTMENTS: "barbershop_appointments_v1",
  BLOCKED_SLOTS: "barbershop_blocked_slots_v1",
};

export const BarbershopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services] = useState<BarberService[]>(INITIAL_SERVICES);
  const [barbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [reviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [info] = useState<BarbershopInfo>(BARBERSHOP_INFO);

  const [activeView, setActiveView] = useState<"client" | "admin">("client");
  const [myAppointmentsModalOpen, setMyAppointmentsModalOpen] = useState(false);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);
  const [lastCreatedAppointment, setLastCreatedAppointment] = useState<Appointment | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<BarberService | null>(null);

  // Load appointments from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading localStorage appointments:", e);
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Load blocked slots
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading localStorage blocked slots:", e);
      }
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    }
  }, [appointments]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blockedSlots));
    }
  }, [blockedSlots]);

  const createAppointment = (input: CreateAppointmentInput): Appointment => {
    const totalPrice = input.services.reduce((acc, s) => acc + s.price, 0);
    const totalDurationMinutes = input.services.reduce((acc, s) => acc + s.durationMinutes, 0);
    const randomCode = `#NB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: randomCode,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerNotes: input.customerNotes,
      barberId: input.barberId,
      services: input.services,
      date: input.date,
      timeSlot: input.timeSlot,
      totalPrice,
      totalDurationMinutes,
      status: "confirmed",
      paymentMethod: input.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setLastCreatedAppointment(newAppointment);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, "cancelled");
  };

  const blockTimeSlot = (barberId: string, date: string, timeSlot: string, reason: string) => {
    const newBlock: BlockedSlot = {
      id: `block-${Date.now()}`,
      barberId,
      date,
      timeSlot,
      reason,
    };
    setBlockedSlots((prev) => [...prev, newBlock]);
  };

  const unblockTimeSlot = (id: string) => {
    setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
  };

  const isSlotAvailable = (barberId: string, date: string, timeSlot: string): boolean => {
    // Check if slot is blocked
    const isBlocked = blockedSlots.some(
      (b) =>
        b.date === date &&
        b.timeSlot === timeSlot &&
        (b.barberId === "all" || b.barberId === barberId || barberId === "any")
    );
    if (isBlocked) return false;

    // Check existing confirmed/in_progress appointments
    const hasConflict = appointments.some(
      (app) =>
        app.date === date &&
        app.timeSlot === timeSlot &&
        app.status !== "cancelled" &&
        (barberId === "any" || app.barberId === "any" || app.barberId === barberId)
    );

    return !hasConflict;
  };

  const getAppointmentsForDate = (date: string, barberId?: string): Appointment[] => {
    return appointments.filter((app) => {
      const matchDate = app.date === date;
      const matchBarber = !barberId || barberId === "all" || app.barberId === barberId;
      return matchDate && matchBarber;
    });
  };

  const getAppointmentsByPhone = (phone: string): Appointment[] => {
    const cleanSearch = phone.replace(/\D/g, "");
    if (!cleanSearch) return [];
    return appointments.filter((app) => {
      const cleanPhone = app.customerPhone.replace(/\D/g, "");
      return cleanPhone.includes(cleanSearch) || cleanSearch.includes(cleanPhone);
    });
  };

  return (
    <BarbershopContext.Provider
      value={{
        services,
        barbers,
        appointments,
        blockedSlots,
        reviews,
        info,
        activeView,
        setActiveView,
        myAppointmentsModalOpen,
        setMyAppointmentsModalOpen,
        bookingWizardOpen,
        setBookingWizardOpen,
        lastCreatedAppointment,
        setLastCreatedAppointment,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        blockTimeSlot,
        unblockTimeSlot,
        isSlotAvailable,
        getAppointmentsForDate,
        getAppointmentsByPhone,
      }}
    >
      {children}
    </BarbershopContext.Provider>
  );
};

export const useBarbershop = () => {
  const context = useContext(BarbershopContext);
  if (!context) {
    throw new Error("useBarbershop must be used within a BarbershopProvider");
  }
  return context;
};
