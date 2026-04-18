"use client";

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Simulated on-chain activity ticker — no external API calls.
// Adds a "live dashboard" web3 ambiance to the events section.
// ─────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateItems(): string[] {
  const block = rand(19_400_000, 19_500_000).toLocaleString();
  const gas = rand(8, 45);
  const txps = rand(12, 28);
  const contracts = rand(1, 9);
  const validators = rand(900_000, 1_050_000).toLocaleString();

  return [
    `⛓ Block #${block}`,
    `⚡ Gas ${gas} gwei`,
    `📦 ${txps} tx/s`,
    `🔐 ${contracts} contracts deployed`,
    `🛡 ${validators} validators`,
  ];
}

export default function ChainTicker() {
  const [items, setItems] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Generate initial data only on client to avoid hydration mismatch
  useEffect(() => {
    setItems(generateItems());
    setMounted(true);
  }, []);

  const cycle = useCallback(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setActiveIdx((i) => {
        const next = (i + 1) % items.length;
        // regenerate data after a full cycle
        if (next === 0) setItems(generateItems());
        return next;
      });
      setVisible(true);
    }, 350);
    return timeout;
  }, [items.length]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      cycle();
    }, 3200);
    return () => clearInterval(interval);
  }, [cycle, mounted]);

  if (dismissed || !mounted) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 mb-8 rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center gap-3 min-w-0">
        {/* live dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>

        <span className="font-mono text-[11px] font-medium tracking-wide text-white/30 uppercase shrink-0 hidden sm:inline">
          Mainnet
        </span>

        <span
          className={`font-mono text-xs text-green-400/70 truncate transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {items[activeIdx]}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/20 hover:text-white/50 transition-colors"
        aria-label="Dismiss ticker"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
