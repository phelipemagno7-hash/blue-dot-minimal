import React from "react";
import { Sparkles, Calendar, Clock, MapPin, CheckCircle2, Award, Star } from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Button } from "../ui/button";

export const HeroSection: React.FC = () => {
  const { info, setBookingWizardOpen } = useBarbershop();

  const scrollToServices = () => {
    const el = document.getElementById("servicos");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24 lg:py-32 text-zinc-100">
      {/* Ambient background glow effects */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <span>Agenda aberta para hoje e próximos dias</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-50 leading-[1.15]">
              Corte clássico, estilo contemporâneo e{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                experiência de mestre.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base text-zinc-400 sm:text-lg mx-auto lg:mx-0">
              Agende seu horário com os melhores profissionais da cidade em menos de 1 minuto. Escolha o serviço, selecione seu barbeiro de preferência e receba a confirmação instantânea no WhatsApp.
            </p>

            {/* Key benefits list */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-left max-w-md mx-auto lg:mx-0 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Sem filas de espera</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Toalha quente grátis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Café expresso & Wi-Fi</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => setBookingWizardOpen(true)}
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 text-base h-12 px-8"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Meu Horário
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToServices}
                className="border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-blue-400 hover:border-blue-500/40 text-base h-12 px-6"
              >
                Ver Serviços & Tabela
              </Button>
            </div>

            {/* Location & Quick Info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-400" />
                {info.address}, {info.city}
              </span>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="h-4 w-4 text-blue-400" />
                {info.openingHoursWeekdays}
              </span>
            </div>
          </div>

          {/* Right Column: Hero Card & Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow frame */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-blue-600/40 to-cyan-400/30 blur-lg opacity-70" />

              {/* Main Card Container */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl">
                {/* Visual Image Banner */}
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80"
                    alt={info.name}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  {/* Floating Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md border border-blue-500/30">
                    <Star className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                    <span>{info.rating} / 5.0</span>
                  </div>

                  {/* Overlaid Banner Text */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Atendimento Exclusivo</span>
                    <h3 className="font-serif text-lg font-bold text-zinc-100">{info.name}</h3>
                  </div>
                </div>

                {/* Highlights inside card */}
                <div className="mt-5 grid grid-cols-2 gap-3 divide-x divide-zinc-800 rounded-xl bg-zinc-950/60 p-3.5 border border-zinc-800/80 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-400">+5.000</div>
                    <div className="text-[11px] text-zinc-400">Clientes Atendidos</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-400">100%</div>
                    <div className="text-[11px] text-zinc-400">Satisfação & Higiene</div>
                  </div>
                </div>

                {/* Fast Book Button inside card */}
                <div className="mt-5">
                  <Button
                    onClick={() => setBookingWizardOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 font-bold text-white hover:from-blue-500 hover:to-blue-400 transition-all shadow-md shadow-blue-500/20"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Iniciar Agendamento Rápido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
