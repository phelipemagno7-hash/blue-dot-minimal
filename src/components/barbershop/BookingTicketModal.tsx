import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Scissors,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  MapPin,
} from "lucide-react";
import { useBarbershop } from "../../context/BarbershopContext";
import { toast } from "sonner";

export const BookingTicketModal: React.FC = () => {
  const {
    lastCreatedAppointment,
    setLastCreatedAppointment,
    barbers,
    info,
  } = useBarbershop();

  const [copiedPix, setCopiedPix] = useState(false);

  if (!lastCreatedAppointment) return null;

  const app = lastCreatedAppointment;
  const barber = barbers.find((b) => b.id === app.barberId);
  const barberName = barber ? barber.name : "Primeiro Barbeiro Disponível";

  const formattedDate = app.date.split("-").reverse().join("/");
  const simulatedPixKey = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}5204000053039865405${app.totalPrice.toFixed(2)}5802BR5915IPABA BARBEARIA6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(simulatedPixKey);
    setCopiedPix(true);
    toast.success("Código PIX Copia e Cola copiado para a área de transferência!");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleWhatsAppNotify = () => {
    const servicesText = app.services.map((s) => s.name).join(", ");
    const text = encodeURIComponent(
      `💈 *CONFIRMAÇÃO DE AGENDAMENTO - ${info.name}*\n\n` +
      `👤 *Cliente:* ${app.customerName}\n` +
      `📅 *Data:* ${formattedDate} às ${app.timeSlot}\n` +
      `✂️ *Serviço(s):* ${servicesText}\n` +
      `💈 *Barbeiro:* ${barberName}\n` +
      `💰 *Total:* R$ ${app.totalPrice.toFixed(2).replace(".", ",")}\n` +
      `🏷️ *Código:* ${app.code}\n` +
      `📍 *Endereço:* ${info.address}\n\n` +
      `_Por favor, confirme meu horário. Obrigado!_`
    );

    const cleanWhatsapp = info.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, "_blank");
  };

  const handleGoogleCalendar = () => {
    const [year, month, day] = app.date.split("-");
    const [hour, minute] = app.timeSlot.split(":");
    
    // Duration in ms
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    const endDate = new Date(startDate.getTime() + app.totalDurationMinutes * 60 * 1000);

    const toGCalStr = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Barbearia: ${app.services.map(s => s.name).join(" + ")}`
    )}&dates=${toGCalStr(startDate)}/${toGCalStr(endDate)}&details=${encodeURIComponent(
      `Agendamento ${app.code} com ${barberName} na ${info.name}.\nTotal: R$ ${app.totalPrice.toFixed(2)}`
    )}&location=${encodeURIComponent(info.address)}`;

    window.open(url, "_blank");
  };

  return (
    <Dialog
      open={!!lastCreatedAppointment}
      onOpenChange={(open) => {
        if (!open) setLastCreatedAppointment(null);
      }}
    >
      <DialogContent className="max-w-lg border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Agendamento Confirmado!
          </DialogTitle>
          <p className="text-xs text-blue-100 mt-1">
            Seu horário foi reservado com sucesso no sistema.
          </p>
        </div>

        {/* Ticket Body */}
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Perforated Style Ticket Card */}
          <div className="relative rounded-2xl border border-dashed border-blue-500/40 bg-zinc-900/90 p-5 shadow-lg">
            {/* Top Info */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Código da Reserva</span>
                <div className="font-mono text-xl font-extrabold text-blue-400">{app.code}</div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Confirmado
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-400 block">Cliente:</span>
                <strong className="text-zinc-100">{app.customerName}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">WhatsApp:</span>
                <strong className="text-zinc-100">{app.customerPhone}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Data:</span>
                <strong className="text-blue-400">{formattedDate}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Horário:</span>
                <strong className="text-blue-400">{app.timeSlot} ({app.totalDurationMinutes} min)</strong>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 block">Profissional:</span>
                <strong className="text-zinc-100">{barberName}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 block">Serviços:</span>
                <div className="mt-1 space-y-1">
                  {app.services.map((s) => (
                    <div key={s.id} className="flex justify-between text-zinc-300">
                      <span>• {s.name}</span>
                      <span className="font-mono text-blue-400">R$ {s.price.toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total and Perforation Bottom */}
            <div className="mt-4 border-t border-zinc-800 pt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Forma de Pagamento:</span>
              <span className="text-xs font-semibold text-zinc-200 uppercase">
                {app.paymentMethod === "pix" ? "PIX Online" : "No Local"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-zinc-100">Valor Total:</span>
              <span className="font-mono text-lg font-bold text-blue-400">
                R$ {app.totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* If PIX: Show QR Code & Copy button */}
          {app.paymentMethod === "pix" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <QrCode className="h-4 w-4" />
                Pague com PIX para Agilizar no Balcão
              </div>

              {/* Simulated QR Code Graphic */}
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(simulatedPixKey)}`}
                  alt="QR Code Pix"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="text-[11px] text-zinc-400">
                Chave PIX Copia e Cola gerada para este agendamento:
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPix}
                className="w-full border-emerald-500/40 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40 text-xs"
              >
                {copiedPix ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                    Copiado com Sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copiar Código PIX
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Quick Actions Buttons */}
          <div className="space-y-2 pt-1">
            <Button
              onClick={handleWhatsAppNotify}
              className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-500 shadow-md text-xs sm:text-sm h-10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Notificar / Confirmar no WhatsApp da Barbearia
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoogleCalendar}
                className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-blue-400 text-xs"
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                Salvar na Agenda
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastCreatedAppointment(null)}
                className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs"
              >
                Fechar Comprovante
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
