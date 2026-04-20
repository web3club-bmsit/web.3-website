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
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.15),\
  transparent_40%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.15),transparent_40%)]" />
      <div className="relative z-10">
        <TeamGrid />
      </div>

    </main>
  );
}