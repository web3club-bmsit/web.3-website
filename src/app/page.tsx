import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Events from "./components/events";

// ─────────────────────────────────────────────────────────────
// Add your section imports here as teammates build them:
//   import Team from "./components/Team";
//   import Blog from "./components/Blog";
// ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <Navbar />

      <Hero />

      {/* Events section */}
      <Events />


      {/*
        Add more sections below as they are built:
        <Team />
        <Blog />
      */}
    </main>
  );
}