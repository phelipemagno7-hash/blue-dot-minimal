import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  PlayCircle,
  XCircle,
  PlusCircle,
  Lock,
  Unlock,
  Scissors,
  Filter,
  ArrowUpDown,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { getTodayDateString, AVAILABLE_TIME_SLOTS } from "../../data/mockData";
import { AppointmentStatus, BarberService } from "../../types/barbershop";
import { toast } from "sonner";

export const AdminDashboard: React.FC = () => {
  const {
    appointments,
    barbers,
    services,
    blockedSlots,
    updateAppointmentStatus,
    blockTimeSlot,
    unblockTimeSlot,
    createAppointment,
    setActiveView,
  } = useBarbershop();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Walk-in modal state
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInBarberId, setWalkInBarberId] = useState(barbers[0]?.id || "any");
  const [walkInServiceId, setWalkInServiceId] = useState(services[0]?.id || "");
  const [walkInTimeSlot, setWalkInTimeSlot] = useState(AVAILABLE_TIME_SLOTS[0] || "10:00");

  // Block slot modal state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockBarberId, setBlockBarberId] = useState("all");
  const [blockTimeSlotVal, setBlockTimeSlotVal] = useState(AVAILABLE_TIME_SLOTS[4] || "12:00");
  const [blockReason, setBlockReason] = useState("Almoço / Intervalo");

  // Filtered appointments
  const dailyAppointments = appointments.filter((app) => {
    const matchDate = app.date === selectedDate;
    const matchBarber = selectedBarberFilter === "all" || app.barberId === selectedBarberFilter;
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    return matchDate && matchBarber && matchStatus;
  });

  // Calculate Metrics for selected date
  const allDailyApps = appointments.filter((app) => app.date === selectedDate);
  const totalRevenue = allDailyApps
    .filter((a) => a.status !== "cancelled")
    .reduce((acc, a) => acc + a.totalPrice, 0);
  const completedCount = allDailyApps.filter((a) => a.status === "completed").length;
  const inProgressCount = allDailyApps.filter((a) => a.status === "in_progress").length;
  const confirmedCount = allDailyApps.filter((a) => a.status === "confirmed").length;

  const handleCreateWalkIn = () => {
    if (!walkInName.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    const serviceObj = services.find((s) => s.id === walkInServiceId);
    if (!serviceObj) return;

    createAppointment({
      customerName: walkInName.trim(),
      customerPhone: walkInPhone.trim() || "(00) 00000-0000",
      customerNotes: "Encaixe no Balcão (Walk-in)",
      barberId: walkInBarberId,
      services: [serviceObj],
      date: selectedDate,
      timeSlot: walkInTimeSlot,
      paymentMethod: "local",
    });

    toast.success("Agendamento de balcão criado!");
    setWalkInModalOpen(false);
    setWalkInName("");
    setWalkInPhone("");
  };

  const handleBlockSlot = () => {
    blockTimeSlot(blockBarberId, selectedDate, blockTimeSlotVal, blockReason);
    toast.success(`Horário ${blockTimeSlotVal} bloqueado para a data ${selectedDate}.`);
    setBlockModalOpen(false);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Confirmado</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Em Atendimento</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Finalizado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-amber-400">Painel do Barbeiro & Gestão</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">Gerencial</Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Controle de atendimentos, faturamento do dia, bloqueios e encaixes rápidos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => setWalkInModalOpen(true)}
              className="bg-amber-500 font-bold text-zinc-950 hover:bg-amber-400 text-xs"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Novo Encaixe Balcão
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setBlockModalOpen(true)}
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs"
            >
              <Lock className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Bloquear Horário
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("client")}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Ver Site
            </Button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs">Faturamento Estimado</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
              R$ {totalRevenue.toFixed(2).replace(".", ",")}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Soma do dia selecionado</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs">Total Agendados</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-amber-400">
              {allDailyApps.length}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">{confirmedCount} pendentes de corte</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs">Em Atendimento</span>
              <PlayCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-amber-500">
              {inProgressCount}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Na cadeira agora</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs">Finalizados</span>
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-blue-400">
              {completedCount}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Atendimentos concluídos</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Picker Input */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-amber-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 w-40 border-zinc-700 bg-zinc-950 text-xs text-zinc-100"
              />
            </div>

            {/* Barber Filter */}
            <div className="w-48">
              <Select value={selectedBarberFilter} onValueChange={setSelectedBarberFilter}>
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-950 text-xs">
                  <SelectValue placeholder="Filtrar por Barbeiro" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="all">Todos os Barbeiros</SelectItem>
                  {barbers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-950 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="in_progress">Em Atendimento</SelectItem>
                  <SelectItem value="completed">Finalizados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-zinc-400">
            Exibindo <strong className="text-amber-400">{dailyAppointments.length}</strong> agendamentos
          </div>
        </div>

        {/* Appointments List / Table */}
        <div className="space-y-3">
          {dailyAppointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
              <CalendarIcon className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm font-medium text-zinc-400">
                Nenhum agendamento encontrado para os filtros selecionados.
              </p>
            </div>
          ) : (
            dailyAppointments.map((app) => {
              const barber = barbers.find((b) => b.id === app.barberId);
              const barberName = barber ? barber.name : "Qualquer Barbeiro";

              return (
                <div
                  key={app.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:bg-zinc-900 hover:border-zinc-700"
                >
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono flex-shrink-0">
                      <Clock className="h-3.5 w-3.5 mb-0.5" />
                      <span className="text-xs font-bold">{app.timeSlot}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-amber-400">{app.code}</span>
                        <h4 className="text-sm font-semibold text-zinc-100">{app.customerName}</h4>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span>📱 {app.customerPhone}</span>
                        <span>•</span>
                        <span>✂️ {app.services.map((s) => s.name).join(" + ")}</span>
                        <span>•</span>
                        <span className="text-amber-300">💈 {barberName}</span>
                      </div>

                      {app.customerNotes && (
                        <p className="mt-1 text-[11px] text-zinc-500 italic">
                          Obs: "{app.customerNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Price */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-zinc-800 pt-2 lg:pt-0">
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        R$ {app.totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-[10px] text-zinc-500 block uppercase">
                        {app.paymentMethod === "pix" ? "PIX" : "No Balcão"}
                      </span>
                    </div>

                    {/* Status Changer Actions */}
                    <div className="flex items-center gap-1.5">
                      {app.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            updateAppointmentStatus(app.id, "in_progress");
                            toast.info(`Atendimento ${app.code} iniciado.`);
                          }}
                          className="bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 h-8"
                        >
                          <PlayCircle className="mr-1 h-3.5 w-3.5" />
                          Iniciar
                        </Button>
                      )}

                      {app.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            updateAppointmentStatus(app.id, "completed");
                            toast.success(`Atendimento ${app.code} finalizado com sucesso!`);
                          }}
                          className="bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 h-8"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Concluir
                        </Button>
                      )}

                      {app.status !== "cancelled" && app.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Deseja cancelar o atendimento ${app.code}?`)) {
                              updateAppointmentStatus(app.id, "cancelled");
                              toast.error(`Atendimento ${app.code} cancelado.`);
                            }
                          }}
                          className="h-8 text-xs text-zinc-400 hover:text-red-400"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Blocked Slots Section */}
        {blockedSlots.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400" />
              Horários Bloqueados / Intervalos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {blockedSlots.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-amber-400">{b.timeSlot}</span>
                    <span className="text-zinc-400 ml-2">({b.date})</span>
                    <p className="text-[11px] text-zinc-500">{b.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      unblockTimeSlot(b.id);
                      toast.success("Horário desbloqueado!");
                    }}
                    className="h-7 text-xs text-zinc-400 hover:text-emerald-400"
                  >
                    <Unlock className="h-3.5 w-3.5 mr-1" />
                    Liberar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Walk-In / Encaixe Rápido */}
      <Dialog open={walkInModalOpen} onOpenChange={setWalkInModalOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-serif text-amber-400 flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Novo Encaixe no Balcão (Walk-In)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs text-zinc-300">Nome do Cliente *</Label>
              <Input
                placeholder="Ex: João Silva"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                className="mt-1 border-zinc-800 bg-zinc-900 text-xs text-zinc-100"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">WhatsApp / Telefone (Opcional)</Label>
              <Input
                placeholder="(11) 99999-9999"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                className="mt-1 border-zinc-800 bg-zinc-900 text-xs text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs text-zinc-300">Serviço</Label>
                <Select value={walkInServiceId} onValueChange={setWalkInServiceId}>
                  <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} (R$ {s.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-300">Barbeiro</Label>
                <Select value={walkInBarberId} onValueChange={setWalkInBarberId}>
                  <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                    {barbers.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Horário</Label>
              <Select value={walkInTimeSlot} onValueChange={setWalkInTimeSlot}>
                <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  {AVAILABLE_TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalkInModalOpen(false)}
              className="border-zinc-800 bg-zinc-900 text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleCreateWalkIn}
              className="bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400"
            >
              Criar Agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Block Time Slot */}
      <Dialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-serif text-amber-400 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Bloquear Horário na Agenda
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-zinc-300">Barbeiro</Label>
              <Select value={blockBarberId} onValueChange={setBlockBarberId}>
                <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="all">Todos os Barbeiros (Pausa Geral)</SelectItem>
                  {barbers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Horário</Label>
              <Select value={blockTimeSlotVal} onValueChange={setBlockTimeSlotVal}>
                <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  {AVAILABLE_TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Motivo do Bloqueio</Label>
              <Input
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ex: Almoço, Folga, Reunião"
                className="mt-1 border-zinc-800 bg-zinc-900 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBlockModalOpen(false)}
              className="border-zinc-800 bg-zinc-900 text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleBlockSlot}
              className="bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400"
            >
              Confirmar Bloqueio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
