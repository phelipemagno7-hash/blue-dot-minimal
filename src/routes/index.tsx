import { createFileRoute } from "@tanstack/react-router";
import { BarbershopProvider, useBarbershop } from "../context/BarbershopContext";
import { Navbar } from "../components/barbershop/Navbar";
import { HeroSection } from "../components/barbershop/HeroSection";
import { ServicesSection } from "../components/barbershop/ServicesSection";
import { TeamSection } from "../components/barbershop/TeamSection";
import { ReviewsSection } from "../components/barbershop/ReviewsSection";
import { Footer } from "../components/barbershop/Footer";
import { BookingWizard } from "../components/barbershop/BookingWizard";
import { BookingTicketModal } from "../components/barbershop/BookingTicketModal";
import { MyAppointmentsModal } from "../components/barbershop/MyAppointmentsModal";
import { AdminDashboard } from "../components/barbershop/AdminDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ipaba Barbearia | Agendamento Online" },
      {
        name: "description",
        content: "Sistema completo de agendamento online para barbearia com escolha de barbeiro, horário e pagamento.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ipaba Barbearia | Agendamento de Barbearia" },
      {
        property: "og:description",
        content: "Agende seu corte, barba e tratamento na Ipaba Barbearia com confirmação instantânea no WhatsApp.",
      },
    ],
  }),
  component: BarbershopApp,
});

function BarbershopContent() {
  const { activeView } = useBarbershop();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 font-sans">
      <Navbar />

      {activeView === "client" ? (
        <main>
          <HeroSection />
          <ServicesSection />
          <TeamSection />
          <ReviewsSection />
          <Footer />
        </main>
      ) : (
        <main>
          <AdminDashboard />
        </main>
      )}

      {/* Global Modals */}
      <BookingWizard />
      <BookingTicketModal />
      <MyAppointmentsModal />
    </div>
  );
}

function BarbershopApp() {
  return (
    <BarbershopProvider>
      <BarbershopContent />
    </BarbershopProvider>
  );
}
