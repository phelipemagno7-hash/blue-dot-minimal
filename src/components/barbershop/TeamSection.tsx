import React from "react";
import { Star, Scissors, Award, Calendar } from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const TeamSection: React.FC = () => {
  const { barbers, setBookingWizardOpen } = useBarbershop();

  return (
    <section id="barbeiros" className="relative bg-zinc-900/40 py-20 border-t border-zinc-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs uppercase tracking-wider font-semibold">
            Mestres da Navalha
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-50">
            Nossos Barbeiros Especialistas
          </h2>
          <p className="text-sm text-zinc-400">
            Profissionais premiados e apaixonados pela arte da barbearia clássica e pelas últimas tendências mundiais.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                {/* Photo with Overlay Badge */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                  {/* Rating Tag */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-zinc-950/80 px-2.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md border border-blue-500/30">
                    <Star className="h-3.5 w-3.5 fill-blue-400" />
                    <span>{barber.rating}</span>
                    <span className="text-zinc-500 text-[10px]">({barber.reviewsCount})</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4">
                  <h3 className="font-serif text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs font-medium text-blue-400/90">{barber.role}</p>

                  <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {barber.bio}
                  </p>

                  {/* Specialties tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {barber.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] text-zinc-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="mt-5 pt-3 border-t border-zinc-900">
                <Button
                  size="sm"
                  onClick={() => setBookingWizardOpen(true)}
                  className="w-full bg-zinc-900 font-semibold text-zinc-300 hover:bg-blue-600 hover:text-white text-xs border border-zinc-800 transition-all"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  Agendar com {barber.name.split(" ")[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
