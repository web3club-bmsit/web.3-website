import Navbar from "./components/navbar";
import UpcomingEventHome from "@/components/UpcomingEventHome";
import HeroSection from "@/components/HeroSection";

// ─────────────────────────────────────────────────────────────
// Add your section imports here as teammates build them:
//   import Team from "./components/Team";
//   import Blog from "./components/Blog";
// ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <Navbar />

      {/* ── PORTAL ANIMATION HERO SECTION ── */}
      <HeroSection />

      <UpcomingEventHome />

      {/*
        Add more sections below as they are built:
        <Team />
        <Blog />
      */}
    </main>
  );
}