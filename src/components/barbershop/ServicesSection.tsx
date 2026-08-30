import React, { useState } from "react";
import { Scissors, Clock, Sparkles, Check, ArrowRight } from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { BarberService } from "../../types/barbershop";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const ServicesSection: React.FC = () => {
  const { services, setBookingWizardOpen, setSelectedServiceForBooking } = useBarbershop();
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const categories = [
    { id: "todos", label: "Todos os Serviços" },
    { id: "cabelo", label: "Cortes de Cabelo" },
    { id: "barba", label: "Barba & Cuidados" },
    { id: "combo", label: "Combos Exclusivos" },
    { id: "tratamento", label: "Tratamentos & Cor" },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === "todos") return true;
    return s.category === activeCategory;
  });

  const handleBookService = (service: BarberService) => {
    setSelectedServiceForBooking(service);
    setBookingWizardOpen(true);
  };

  return (
    <section id="servicos" className="relative bg-zinc-950 py-20 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs uppercase tracking-wider font-semibold">
            Tabela de Serviços & Valores
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-50">
            Nossos Serviços Especializados
          </h2>
          <p className="text-sm text-zinc-400">
            Trabalhamos com os melhores produtos do mercado mundial para garantir corte impecável, alinhamento duradouro e bem-estar.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 ${
                service.popular
                  ? "border-amber-500/50 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 shadow-xl shadow-amber-500/5"
                  : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-amber-500 text-zinc-950 font-bold text-[10px] shadow-sm uppercase tracking-wide border-0">
                    ★ Destaque
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="mt-2 font-serif text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                  {service.name}
                </h3>

                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 border-t border-zinc-800/80 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Investimento</span>
                  <span className="font-mono text-xl font-extrabold text-amber-400">
                    R$ {service.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleBookService(service)}
                  className="bg-zinc-800 font-semibold text-zinc-200 hover:bg-amber-500 hover:text-zinc-950 text-xs transition-all"
                >
                  Agendar Este
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
