import React, { useState } from "react";
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
import {
  Search,
  Calendar,
  Clock,
  User,
  Scissors,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { AppointmentStatus } from "../../types/barbershop";
import { toast } from "sonner";

export const MyAppointmentsModal: React.FC = () => {
  const {
    myAppointmentsModalOpen,
    setMyAppointmentsModalOpen,
    getAppointmentsByPhone,
    cancelAppointment,
    barbers,
    setBookingWizardOpen,
  } = useBarbershop();

  const [phoneSearch, setPhoneSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const cleanDigits = phoneSearch.replace(/\D/g, "");
  const results = getAppointmentsByPhone(cleanDigits);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Confirmado</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Em Atendimento</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Concluído</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelado</Badge>;
    }
  };

  const handleCancel = (id: string, code: string) => {
    if (window.confirm(`Tem certeza que deseja cancelar o agendamento ${code}?`)) {
      cancelAppointment(id);
      toast.success(`Agendamento ${code} cancelado.`);
    }
  };

  return (
    <Dialog open={myAppointmentsModalOpen} onOpenChange={setMyAppointmentsModalOpen}>
      <DialogContent className="max-w-xl border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-serif text-amber-400">
            <Calendar className="h-5 w-5 text-amber-400" />
            Meus Agendamentos
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Consulte seus horários agendados informando seu telefone ou WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Search Input Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Digite seu WhatsApp/Telefone..."
                value={phoneSearch}
                onChange={(e) => {
                  setPhoneSearch(e.target.value);
                  setHasSearched(true);
                }}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 pl-9 text-sm"
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
            <Button
              onClick={() => setHasSearched(true)}
              className="bg-amber-500 font-bold text-zinc-950 hover:bg-amber-400 text-xs px-4"
            >
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Buscar
            </Button>
          </div>

          {/* Quick chip demo helper */}
          {!hasSearched && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400">
              <p className="font-medium text-zinc-300 mb-1.5">Números para teste rápido:</p>
              <div className="flex flex-wrap gap-2">
                {["(11) 98765-4321", "(11) 97654-3210", "(11) 96543-2109"].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPhoneSearch(p);
                      setHasSearched(true);
                    }}
                    className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-amber-400 hover:border-amber-500"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {hasSearched && (
            <div className="space-y-3">
              {results.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">Nenhum agendamento encontrado</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Verifique se o número digitado confere com o cadastrado no momento da reserva.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setMyAppointmentsModalOpen(false);
                      setBookingWizardOpen(true);
                    }}
                    className="mt-4 bg-amber-500 text-zinc-950 font-bold text-xs"
                  >
                    Fazer um Agendamento Agora
                  </Button>
                </div>
              ) : (
                results.map((app) => {
                  const barber = barbers.find((b) => b.id === app.barberId);
                  const barberName = barber ? barber.name : "Primeiro Barbeiro Disponível";
                  const formattedDate = app.date.split("-").reverse().join("/");

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 transition-all hover:border-zinc-700"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400">{app.code}</span>
                          <span className="text-xs text-zinc-400">• {app.customerName}</span>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-500 block">Data e Horário:</span>
                          <strong className="text-zinc-200">{formattedDate} às {app.timeSlot}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Profissional:</span>
                          <strong className="text-zinc-200">{barberName}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500 block">Serviços:</span>
                          <span className="text-zinc-300">{app.services.map((s) => s.name).join(" + ")}</span>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-zinc-800/80 pt-2.5">
                        <span className="font-mono text-sm font-bold text-amber-400">
                          R$ {app.totalPrice.toFixed(2).replace(".", ",")}
                        </span>

                        {app.status === "confirmed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(app.id, app.code)}
                            className="h-8 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300"
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                            Cancelar Horário
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
