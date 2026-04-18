"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// ADD YOUR TABS HERE — just push an object to this array.
// { label: "Team", href: "#team" }
// ─────────────────────────────────────────────────────────────
const NAV_TABS = [
  { label: "Home",   href: "#home"   },
  { label: "Events", href: "#events" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active,   setActive]   = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-green-500/10 shadow-lg" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="font-mono text-green-400 font-bold text-sm tracking-wider">
            {"{ club }"}
          </a>

          {/* Desktop tabs */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_TABS.map((tab) => (
              <li key={tab.label}>
                <a
                  href={tab.href}
                  onClick={() => setActive(tab.label)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    active === tab.label
                      ? "text-green-400 bg-green-400/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#events"
            className="hidden md:block px-4 py-2 bg-green-400 text-black font-mono text-xs font-bold rounded-md hover:bg-green-300 transition-colors"
          >
            Register →
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-green-500/10 flex flex-col px-6 py-4 gap-2">
          {NAV_TABS.map((tab) => (
            <a
              key={tab.label}
              href={tab.href}
              onClick={() => { setActive(tab.label); setMenuOpen(false); }}
              className={`py-2 text-sm font-semibold border-b border-white/5 transition-colors ${
                active === tab.label ? "text-green-400" : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}