import Navbar from "./components/navbar";
import Events from "./components/events";
import TeamGrid from "@/components/TeamGrid";
import UpcomingEventHome from "@/components/UpcomingEventHome";
import HeroSection from "@/components/HeroSection";
// ─────────────────────────────────────────────────────────────
// Add your section imports here as teammates build them:
//   import Team from "./components/Team";
//   import Blog from "./components/Blog";
// ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white relative overflow-hidden">
      <Navbar />
      
      <HeroSection />
      
      <div className="relative z-10 w-full">
        <UpcomingEventHome />
      </div>
    </main>
  );
}