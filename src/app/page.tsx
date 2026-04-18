import Navbar from "./components/navbar";
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

      {/* Hero — replace with your own section */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-400 mb-4">
          // welcome to
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          The Club
        </h1>
        <p className="text-base text-white/40 max-w-md leading-relaxed">
          A student developer community. Build, compete, and ship things that matter.
        </p>
        {/* Other team members: add your hero content here */}
      </section>

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