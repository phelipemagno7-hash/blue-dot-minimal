import React from "react";
import { Star, Quote, ThumbsUp, CheckCircle2 } from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { Badge } from "../ui/badge";

export const ReviewsSection: React.FC = () => {
  const { reviews, info } = useBarbershop();

  return (
    <section id="avaliacoes" className="relative bg-zinc-950 py-20 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with summary stats */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-zinc-900">
          <div className="space-y-3 max-w-xl">
            <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs uppercase tracking-wider font-semibold">
              Depoimentos Reais
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-50">
              O Que Dizem Nossos Clientes
            </h2>
            <p className="text-sm text-zinc-400">
              A satisfação de quem senta em nossas cadeiras é o nosso maior selo de qualidade.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 self-start md:self-auto">
            <div className="text-center border-r border-zinc-800 pr-4">
              <div className="font-mono text-3xl font-extrabold text-blue-400">{info.rating}</div>
              <div className="flex text-blue-400 text-xs mt-1">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">Excelente Reputação</div>
              <div className="text-[11px] text-zinc-400">Mais de {info.totalReviews} avaliações 5 estrelas no Google e sistema interno</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:bg-zinc-900/80 hover:border-zinc-700"
            >
              <div>
                <Quote className="h-6 w-6 text-blue-500/30 mb-3" />
                <div className="flex text-blue-400 text-sm mb-2">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-blue-400 text-blue-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 border-t border-zinc-800/80 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="h-9 w-9 rounded-full object-cover border border-blue-500/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{rev.author}</h4>
                    <span className="text-[10px] text-zinc-500">{rev.date} • {rev.service}</span>
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" title="Cliente verificado" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
