import {
  socialLinks,
  legalLinks,
  copyrightText,
  displayLines,
} from "@/data/footerData";

// ─────────────────────────────────────────────────────────────
// Footer — roiheads.com inspired
// Massive viewport-width display type, minimal links, no grid.
// ─────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative bg-[#08080c] text-white overflow-hidden">
      {/* ── Top row: copyright left · socials right ── */}
      <div className="flex items-start justify-between px-6 pt-10 sm:px-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
          {copyrightText}
        </span>

        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors duration-200 hover:text-green-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Giant display text ── */}
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        {displayLines.map((line) => (
          <p
            key={line.text}
            className={`m-0 leading-[0.9] font-black uppercase tracking-tighter ${
              line.accent ? "text-green-400" : "text-white"
            }`}
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* ── Bottom row: legal links ── */}
      <div className="flex items-end justify-between px-6 pb-8 sm:px-10">
        <div className="flex gap-6">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30 transition-colors duration-200 hover:text-white/60"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
