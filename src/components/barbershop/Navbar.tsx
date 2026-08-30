import React from "react";
import { Scissors, Calendar, Clock, Phone, User, ShieldCheck, Sparkles } from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const Navbar: React.FC = () => {
  const {
    info,
    activeView,
    setActiveView,
    setBookingWizardOpen,
    setMyAppointmentsModalOpen,
  } = useBarbershop();

  const scrollToSection = (id: string) => {
    if (activeView !== "client") {
      setActiveView("client");
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/20 bg-zinc-950/90 backdrop-blur-md transition-all">
      {/* Top micro-bar with contact and status */}
      <div className="hidden border-b border-zinc-800/60 bg-zinc-900/60 px-4 py-1.5 text-xs text-zinc-400 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              {info.openingHoursWeekdays}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-zinc-400" />
              {info.phone}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">{info.address}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <span>★ {info.rating}</span>
              <span className="text-zinc-500">({info.totalReviews} avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveView("client");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 text-zinc-950 font-bold transition-transform group-hover:scale-105">
            <Scissors className="h-5 w-5 text-zinc-950 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-zinc-100 sm:text-xl">
                {info.name}
              </span>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-semibold tracking-wider">
                Premium
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Barbearia & Estilo Clássico</p>
          </div>
        </div>

        {/* Navigation Links (Client Mode) */}
        {activeView === "client" ? (
          <nav className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => scrollToSection("servicos")}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400 cursor-pointer"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("barbeiros")}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400 cursor-pointer"
            >
              Nossa Equipe
            </button>
            <button
              onClick={() => scrollToSection("avaliacoes")}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400 cursor-pointer"
            >
              Avaliações
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400 cursor-pointer"
            >
              Onde Estamos
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Painel do Barbeiro / Gestão Ativa
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* My Appointments Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMyAppointmentsModalOpen(true)}
            className="border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-amber-500/40 hover:bg-zinc-800 hover:text-amber-300 text-xs sm:text-sm font-medium"
          >
            <Calendar className="h-3.5 w-3.5 sm:mr-1.5 text-amber-400" />
            <span className="hidden sm:inline">Meus Agendamentos</span>
            <span className="sm:hidden">Agendados</span>
          </Button>

          {/* Book Now Main CTA */}
          {activeView === "client" ? (
            <Button
              size="sm"
              onClick={() => setBookingWizardOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-zinc-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 text-xs sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 sm:mr-1.5" />
              Agendar Agora
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setActiveView("client")}
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-xs"
            >
              Voltar ao Site
            </Button>
          )}

          {/* Admin / Barber Toggle Switch */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveView(activeView === "client" ? "admin" : "client")}
            title={activeView === "client" ? "Acessar Painel do Barbeiro" : "Voltar à Visão do Cliente"}
            className="h-9 w-9 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
