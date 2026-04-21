import Navbar from "./components/navbar";
import Events from "./components/events";
import TeamGrid from "@/components/TeamGrid";
import UpcomingEventHome from "@/components/UpcomingEventHome";
import HeroInteractive from "@/components/HeroInteractive";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />
      
      <HeroInteractive />
      
      <div className="relative z-10 w-full bg-background">
        <UpcomingEventHome />
        <Footer />
      </div>
    </main>
  );
}