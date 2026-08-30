import React from "react";
import {
  Scissors,
  MapPin,
  Phone,
  Clock,
  Instagram,
  MessageCircle,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Button } from "../ui/button";

export const Footer: React.FC = () => {
  const { info, setBookingWizardOpen, setActiveView } = useBarbershop();

  const handleOpenWhatsApp = () => {
    const cleanNumber = info.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20barbearia.`, "_blank");
  };

  return (
    <footer id="contato" className="relative border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      {/* Top CTA Banner */}
      <div className="border-b border-zinc-800/80 bg-gradient-to-r from-blue-950/30 via-zinc-900 to-blue-950/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
            Pronto para renovar seu visual hoje?
          </h3>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Evite filas e garanta seu horário com nossos mestres barbeiros em poucos cliques.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={() => setBookingWizardOpen(true)}
              className="bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-xl shadow-blue-500/25 text-sm h-11 px-8"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Horário Online
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                <Scissors className="h-5 w-5 rotate-45" />
              </div>
              <span className="font-serif text-xl font-bold text-zinc-100">{info.name}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {info.tagline}. Ambiente climatizado, chopp gelado e atendimento de alto padrão.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Horários */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Horários de Atendimento
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{info.openingHoursWeekdays}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{info.openingHoursSaturday}</span>
              </li>
              <li className="flex items-start gap-2 text-zinc-500">
                <Clock className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <span>{info.openingHoursSunday}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Localização & Contato */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Onde Estamos
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{info.address}, {info.city}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>{info.phone}</span>
              </p>
              <button
                onClick={handleOpenWhatsApp}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-semibold"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Conversar no WhatsApp
              </button>
            </div>
          </div>

          {/* Col 4: Acesso Rápido & Painel */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Área Administrativa
            </h4>
            <p className="text-xs text-zinc-400">
              Área restrita para profissionais da barbearia gerenciarem a fila e faturamento.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveView("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:border-blue-500/50 hover:bg-zinc-800 hover:text-blue-300"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
              Acessar Painel do Barbeiro
            </Button>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {info.name}. Todos os direitos reservados.</p>
          <p className="text-zinc-500">Desenvolvido com excelência para a sua barbearia.</p>
        </div>
      </div>
    </footer>
  );
};
