"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#CDEF33";
const DURATION = 2800;

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const tick = useCallback((now: number) => {
    if (!startRef.current) startRef.current = now;
    const elapsed = now - startRef.current;
    const pct = Math.min(elapsed / DURATION, 1);
    // Ease-out cubic — satisfying slow-down at the end
    const eased = 1 - Math.pow(1 - pct, 3);
    setProgress(Math.round(eased * 100));

    if (pct < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Hold at 100% (fully filled) briefly, then exit
      setTimeout(() => setShow(false), 500);
    }
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  // SVG coordinate space: 800 × 220
  // Fill rises from y=220 (empty) → y=0 (full) as progress goes 0→100
  const SVG_H = 220;
  const fillY = SVG_H - (progress / 100) * SVG_H; // top of the fill rect
  const waveAmp = 12; // wave amplitude (px in SVG coords)
  // The wave group sits just above the fill rect; translate it so wave peak ≈ fillY
  const waveTopY = fillY - waveAmp;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08080c]"
        >
          {/* ─── Liquid-fill text via SVG clipPath ─── */}
          <div className="select-none w-[85vw] max-w-2xl" aria-hidden>
            <svg
              viewBox={`0 0 800 ${SVG_H}`}
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto overflow-visible"
            >
              <defs>
                {/*
                  The text shape is used as a clip mask.
                  Everything rendered inside <g clipPath="url(#tc)"> is
                  pixel-perfectly confined to the letter outlines.
                */}
                <clipPath id="tc">
                  <text
                    x="400"
                    y="185"
                    textAnchor="middle"
                    fontFamily="'Arial Black', 'Impact', system-ui"
                    fontWeight="900"
                    fontSize="195"
                    letterSpacing="-6"
                  >
                    WEB3
                  </text>
                </clipPath>
              </defs>

              {/* Ghost outline — visible through unfilled area */}
              <text
                x="400"
                y="185"
                textAnchor="middle"
                fontFamily="'Arial Black', 'Impact', system-ui"
                fontWeight="900"
                fontSize="195"
                letterSpacing="-6"
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1.5"
              >
                WEB3
              </text>

              {/* ── All fill content clipped to letter shapes ── */}
              <g clipPath="url(#tc)">
                {/* Solid fill rectangle — rises from bottom */}
                <rect
                  x="0"
                  y={fillY + waveAmp}
                  width="800"
                  height={SVG_H}
                  fill={ACCENT}
                />

                {/*
                  Animated wave sitting right at the fill boundary.
                  The <g> is translated so the wave crest lands at fillY.
                  The path itself always starts at y=waveAmp (the crest line)
                  and fills downward — the clipPath hides everything outside
                  the letters.
                */}
                <g transform={`translate(0, ${waveTopY})`}>
                  <path fill={ACCENT}>
                    <animate
                      attributeName="d"
                      dur="1.6s"
                      repeatCount="indefinite"
                      calcMode="spline"
                      keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                      values={`
                        M0,${waveAmp} Q100,0 200,${waveAmp} T400,${waveAmp} T600,${waveAmp} T800,${waveAmp} V${SVG_H + waveAmp * 2} H0 Z;
                        M0,${waveAmp} Q100,${waveAmp * 2} 200,${waveAmp} T400,${waveAmp} T600,${waveAmp} T800,${waveAmp} V${SVG_H + waveAmp * 2} H0 Z;
                        M0,${waveAmp} Q100,0 200,${waveAmp} T400,${waveAmp} T600,${waveAmp} T800,${waveAmp} V${SVG_H + waveAmp * 2} H0 Z
                      `}
                    />
                  </path>
                </g>
              </g>
            </svg>
          </div>

          {/* ─── Counter + progress bar ─── */}
          <div className="mt-6 flex flex-col items-center gap-3 w-52">
            <span className="font-mono text-sm text-white/40 tracking-widest">
              loading...{" "}
              <span style={{ color: ACCENT }}>{progress}%</span>
            </span>

            <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: ACCENT, opacity: 0.7 }}
                transition={{ duration: 0.08 }}
              />
            </div>
          </div>

          {/* ─── Corner branding ─── */}
          <span className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-widest uppercase">
            Web3 BMSIT
          </span>
          <span className="absolute bottom-6 right-6 font-mono text-[10px] text-white/15 tracking-widest uppercase">
            Est. 2024
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
