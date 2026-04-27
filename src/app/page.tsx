import Hero from "./components/Hero";
import Events from "./components/events";
import TeamGrid from "@/components/TeamGrid";
import UpcomingEventHome from "@/components/UpcomingEventHome";
import HeroInteractive from "@/components/HeroInteractive";
import Footer from "@/components/Footer";
import DecryptoUpdates from "@/components/DecryptoUpdates";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Hero />

      {/* Events section */}
      <UpcomingEventHome />

      {/* Decrypto Updates — directly above footer */}
      <DecryptoUpdates />
    </main>
  );
}