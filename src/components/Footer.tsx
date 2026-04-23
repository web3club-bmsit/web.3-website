"use client";

import { useTheme } from "next-themes";
import {
  socialLinks,
  legalLinks,
  copyrightText,
  displayLines,
} from "@/data/footerData";

// ─────────────────────────────────────────────────────────────
// Footer — roiheads.com inspired
// Massive viewport-width display type, minimal links, no grid.
// Theme-aware: dark = cinematic black, light = vivid gradient
// ─────────────────────────────────────────────────────────────

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-[#08080c] text-white"
          : "bg-background text-slate-800"
      }`}
    >
      {/* Light mode decorative blobs */}
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-[600px] h-[300px] bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-slate-300/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />
          {/* Divider line at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
        </>
      )}
      {isDark && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {/* ── Top row: copyright left · socials right ── */}
      <div className="flex items-start justify-between px-6 pt-10 sm:px-10 relative z-10">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
            isDark ? "text-white/40" : "text-slate-400"
          }`}
        >
          {copyrightText}
        </span>

        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-200 ${
                isDark
                  ? "text-white/40 hover:text-green-400"
                  : "text-slate-400 hover:text-green-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Giant display text ── */}
      <div className="px-4 py-8 sm:px-6 sm:py-12 relative z-10">
        {displayLines.map((line) => (
          <p
            key={line.text}
            className={`m-0 leading-[0.9] font-black uppercase tracking-tighter transition-colors duration-500 ${
              line.accent
                ? "text-accent"
                : "text-foreground"
            }`}
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* ── Bottom row: legal links ── */}
      <div className="flex items-end justify-between px-6 pb-8 sm:px-10 relative z-10">
        <div className="flex gap-6">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-200 ${
                isDark
                  ? "text-white/30 hover:text-white/60"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Light mode: small accent dot for visual flair */}
        {!isDark && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-green-600">
              Web3 BMSIT
            </span>
          </div>
        )}
      </div>

      {/* ── Attribution ── */}
      <div className="w-full text-center pb-6 text-[10px] text-foreground/40 font-mono tracking-widest uppercase relative z-10">
        Icons made from <a href="https://www.onlinewebfonts.com/icon" target="_blank" rel="noreferrer" className="underline hover:text-foreground">svg icons</a> is licensed by CC BY 4.0
      </div>
    </footer>
  );
}
