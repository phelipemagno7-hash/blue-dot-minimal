import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Scissors,
  User,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  QrCode,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { BarberService, ServiceCategory, Barber } from "../../types/barbershop";
import { AVAILABLE_TIME_SLOTS, getTodayDateString } from "../../data/mockData";
import { toast } from "sonner";

export const BookingWizard: React.FC = () => {
  const {
    services,
    barbers,
    bookingWizardOpen,
    setBookingWizardOpen,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    createAppointment,
    isSlotAvailable,
  } = useBarbershop();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedServices, setSelectedServices] = useState<BarberService[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  
  // Customer details
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"local" | "pix">("local");

  // Sync if opened with a preselected service
  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedServices([selectedServiceForBooking]);
    }
  }, [selectedServiceForBooking]);

  // Reset wizard on close
  const handleOpenChange = (open: boolean) => {
    setBookingWizardOpen(open);
    if (!open) {
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedTimeSlot("");
        setSelectedServiceForBooking(null);
      }, 300);
    }
  };

  const toggleService = (service: BarberService) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Filter services by category
  const filteredServices = services.filter((s) => {
    if (selectedCategory === "todos") return true;
    return s.category === selectedCategory;
  });

  // Calculate next 7 selectable dates
  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    return {
      dateStr,
      dayNum: d.getDate(),
      dayName: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekdayNames[dayOfWeek],
      monthName: monthNames[d.getMonth()],
      isClosed: dayOfWeek === 0 || dayOfWeek === 1, // Closed Sunday & Monday
    };
  });

  // Time slot periods
  const morningSlots = AVAILABLE_TIME_SLOTS.filter((t) => parseInt(t.split(":")[0]) < 12);
  const afternoonSlots = AVAILABLE_TIME_SLOTS.filter((t) => {
    const hour = parseInt(t.split(":")[0]);
    return hour >= 12 && hour < 18;
  });
  const eveningSlots = AVAILABLE_TIME_SLOTS.filter((t) => parseInt(t.split(":")[0]) >= 18);

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  // Phone input formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setCustomerPhone(value);
  };

  const handleFinishBooking = () => {
    if (!customerName.trim()) {
      toast.error("Por favor, preencha o seu nome completo.");
      return;
    }
    if (customerPhone.replace(/\D/g, "").length < 10) {
      toast.error("Por favor, digite um telefone/WhatsApp válido com DDD.");
      return;
    }

    try {
      const newApp = createAppointment({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerNotes: customerNotes.trim() || undefined,
        barberId: selectedBarberId,
        services: selectedServices,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        paymentMethod,
      });

      toast.success("Agendamento confirmado com sucesso!", {
        description: `Código do agendamento: ${newApp.code}`,
      });

      setBookingWizardOpen(false);
    } catch (e) {
      toast.error("Ocorreu um erro ao agendar. Tente novamente.");
    }
  };

  return (
    <Dialog open={bookingWizardOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header with Progress Steps */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
          <DialogHeader className="mb-3">
            <DialogTitle className="flex items-center gap-2 text-xl font-serif text-amber-400">
              <Scissors className="h-5 w-5 text-amber-400" />
              Agendar Horário
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Passo {currentStep} de 4 • {
                currentStep === 1 ? "Selecione os Serviços" :
                currentStep === 2 ? "Escolha o Profissional" :
                currentStep === 3 ? "Escolha Data e Horário" :
                "Identificação & Confirmação"
              }
            </DialogDescription>
          </DialogHeader>

          {/* Stepper indicator */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: "Serviços" },
              { num: 2, label: "Barbeiro" },
              { num: 3, label: "Horário" },
              { num: 4, label: "Confirmar" },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    currentStep >= step.num ? "bg-amber-500" : "bg-zinc-800"
                  }`}
                />
                <span className={`text-[10px] font-medium hidden sm:inline ${
                  currentStep >= step.num ? "text-amber-400" : "text-zinc-500"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Body Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* STEP 1: SERVICES SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-zinc-800 pb-3">
                {[
                  { id: "todos", label: "Todos" },
                  { id: "cabelo", label: "Cabelo" },
                  { id: "barba", label: "Barba" },
                  { id: "combo", label: "Combos" },
                  { id: "tratamento", label: "Tratamentos" },
                  { id: "outros", label: "Outros" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-amber-500 text-zinc-950 font-bold"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Service Cards List */}
              <div className="space-y-2.5">
                {filteredServices.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`group relative flex cursor-pointer items-start justify-between rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? "border-amber-500/80 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-500 text-zinc-950"
                              : "border-zinc-700 bg-zinc-800 text-transparent group-hover:border-zinc-500"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-zinc-100">{service.name}</h4>
                            {service.popular && (
                              <Badge className="border-amber-500/40 bg-amber-500/20 text-amber-300 text-[10px] py-0 px-1.5">
                                Mais Pedido
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-zinc-400 leading-relaxed pr-2">
                            {service.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-amber-400" />
                              {service.durationMinutes} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-base font-bold text-amber-400 font-mono">
                          R$ {service.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: BARBER SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Selecione o profissional de sua preferência ou opte pelo primeiro disponível para maior agilidade:
              </p>

              {/* Any Barber Card */}
              <div
                onClick={() => setSelectedBarberId("any")}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                  selectedBarberId === "any"
                    ? "border-amber-500 bg-amber-500/10 shadow-sm"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">Primeiro Barbeiro Disponível</h4>
                    <p className="text-xs text-zinc-400">Ideal para encaixes rápidos com o melhor horário.</p>
                  </div>
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    selectedBarberId === "any"
                      ? "border-amber-500 bg-amber-500 text-zinc-950"
                      : "border-zinc-700"
                  }`}
                >
                  {selectedBarberId === "any" && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>

              {/* Individual Barbers */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 shadow-sm"
                          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="h-12 w-12 rounded-xl object-cover border border-zinc-700 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-zinc-100 truncate">{barber.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {barber.rating}
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-medium truncate">{barber.role}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{barber.bio}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Date selection bar */}
              <div>
                <Label className="text-xs font-medium text-zinc-300 mb-2 block">
                  1. Escolha o Dia:
                </Label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {nextDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        disabled={item.isClosed}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedTimeSlot("");
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all ${
                          item.isClosed
                            ? "opacity-35 cursor-not-allowed border-zinc-800 bg-zinc-950"
                            : isSelected
                            ? "border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-sm"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold text-zinc-400">
                          {item.dayName}
                        </span>
                        <span className="text-base font-bold my-0.5">{item.dayNum}</span>
                        <span className="text-[9px] text-zinc-500">{item.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slot picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium text-zinc-300">
                    2. Escolha o Horário:
                  </Label>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                    Duração total estimada: <strong className="text-amber-400">{totalDuration} min</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Manhã */}
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Manhã
                    </span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {morningSlots.map((slot) => {
                        const available = isSlotAvailable(selectedBarberId, selectedDate, slot);
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            disabled={!available}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                              !available
                                ? "cursor-not-allowed border-zinc-900 bg-zinc-950 text-zinc-600 line-through"
                                : isSelected
                                ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                                : "border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tarde */}
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Tarde
                    </span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {afternoonSlots.map((slot) => {
                        const available = isSlotAvailable(selectedBarberId, selectedDate, slot);
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            disabled={!available}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                              !available
                                ? "cursor-not-allowed border-zinc-900 bg-zinc-950 text-zinc-600 line-through"
                                : isSelected
                                ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                                : "border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Noite */}
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Noite
                    </span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {eveningSlots.map((slot) => {
                        const available = isSlotAvailable(selectedBarberId, selectedDate, slot);
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            disabled={!available}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                              !available
                                ? "cursor-not-allowed border-zinc-900 bg-zinc-950 text-zinc-600 line-through"
                                : isSelected
                                ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                                : "border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS & PAYMENT METHOD */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Order Summary Box */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="text-zinc-400">Serviços:</span>
                  <span className="font-semibold text-zinc-100 text-right">
                    {selectedServices.map((s) => s.name).join(" + ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="text-zinc-400">Profissional:</span>
                  <span className="font-semibold text-amber-400">
                    {selectedBarberId === "any" ? "Primeiro Barbeiro Disponível" : selectedBarber?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="text-zinc-400">Data e Horário:</span>
                  <span className="font-semibold text-zinc-100">
                    {selectedDate.split("-").reverse().join("/")} às {selectedTimeSlot} ({totalDuration} min)
                  </span>
                </div>
                <div className="border-t border-amber-500/20 pt-2 flex items-center justify-between font-bold">
                  <span className="text-xs text-amber-300">Valor Total:</span>
                  <span className="text-base text-amber-400 font-mono">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              {/* Client Form Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cust-name" className="text-xs text-zinc-300">
                    Nome Completo *
                  </Label>
                  <Input
                    id="cust-name"
                    placeholder="Ex: Carlos Eduardo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cust-phone" className="text-xs text-zinc-300">
                      WhatsApp / Telefone *
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="cust-phone"
                        placeholder="(11) 99999-9999"
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        className="border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 text-sm pl-9"
                      />
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cust-email" className="text-xs text-zinc-300">
                      E-mail (Opcional)
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="cust-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 text-sm pl-9"
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cust-notes" className="text-xs text-zinc-300">
                    Observação ou Preferência (Opcional)
                  </Label>
                  <Textarea
                    id="cust-notes"
                    placeholder="Ex: Quero um degradê bem disfarçado navalhado..."
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 text-xs"
                  />
                </div>

                {/* Payment Option */}
                <div>
                  <Label className="text-xs text-zinc-300 mb-1.5 block">
                    Forma de Pagamento Preferida:
                  </Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div
                      onClick={() => setPaymentMethod("local")}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition-all ${
                        paymentMethod === "local"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-zinc-100">Pagar no Local</div>
                        <div className="text-[10px] text-zinc-400">Dinheiro, Cartão ou Pix no caixa</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("pix")}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition-all ${
                        paymentMethod === "pix"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <QrCode className="h-4 w-4 text-emerald-400" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-zinc-100">PIX Online</div>
                        <div className="text-[10px] text-zinc-400">QR Code instantâneo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Next/Back buttons */}
        <div className="border-t border-zinc-800 bg-zinc-900/90 px-6 py-3.5 flex items-center justify-between">
          <div>
            {selectedServices.length > 0 && (
              <div>
                <span className="text-[11px] text-zinc-400">
                  {selectedServices.length} {selectedServices.length === 1 ? "serviço" : "serviços"} selecionados:
                </span>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                  <span className="text-[11px] text-zinc-400 font-sans ml-1 font-normal">
                    ({totalDuration} min)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((p) => p - 1)}
                className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs"
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                Voltar
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                size="sm"
                disabled={
                  (currentStep === 1 && selectedServices.length === 0) ||
                  (currentStep === 3 && !selectedTimeSlot)
                }
                onClick={() => setCurrentStep((p) => p + 1)}
                className="bg-amber-500 font-bold text-zinc-950 hover:bg-amber-400 text-xs disabled:opacity-50"
              >
                Avançar
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFinishBooking}
                className="bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-zinc-950 hover:from-amber-400 hover:to-amber-500 text-xs shadow-md shadow-amber-500/20"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Confirmar Agendamento
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
