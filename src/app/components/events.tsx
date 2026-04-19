"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { EVENTS, HackathonEvent, EventMeta } from "@/data/events";
import HackathonCard from "./hackathon/hackathonCard";
import TerminalModal from "./hackathon/terminalModal";

// ─────────────────────────────────────────────────────────────
// Events section — vertical blockchain timeline layout
// ─────────────────────────────────────────────────────────────

export default function Events() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [modalEvent, setModalEvent] = useState<EventMeta | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [chainHeight, setChainHeight] = useState(0);

  const now = useMemo(() => Date.now(), []);

  const { upcoming, past } = useMemo(() => {
    const up: HackathonEvent[] = [];
    const pa: HackathonEvent[] = [];
    EVENTS.forEach((e) => {
      if (new Date(e.startDate).getTime() > now) up.push(e);
      else pa.push(e);
    });
    up.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    pa.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    return { upcoming: up, past: pa };
  }, [now]);

  const activeEvents = activeTab === "upcoming" ? upcoming : past;
  const isPast = activeTab === "past";

  // ResizeObserver — dynamically compute SVG chain height
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChainHeight(entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven path animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);

  return (
    <>
      <section
        id="events"
        ref={sectionRef}
        className="relative max-w-5xl mx-auto px-5 sm:px-6 py-24"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(74,222,128,0.03) 49px, rgba(74,222,128,0.03) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(74,222,128,0.03) 49px, rgba(74,222,128,0.03) 50px)",
        }}
      >
        {/* ── Section header ─────────────────────────────────── */}
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-green-400/60 mb-3">
          // events &amp; competitions
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-[1.1] tracking-tight">
          What&apos;s happening{" "}
          <span className="text-white/30">on-chain</span>
        </h2>
        <p className="text-sm sm:text-base text-white/35 max-w-lg leading-relaxed mb-10">
          Hackathons, workshops, and challenges — built for students who ship
          on-chain. Expand a card for details, then register from the terminal.
        </p>

        {/* ── Tab bar (Upcoming / Past) ──────────────────────── */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06] w-fit mb-14">
          {(["upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs font-semibold px-4 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-green-400/[0.12] text-green-400 border border-green-400/20"
                  : "text-white/30 hover:text-white/50 border border-transparent"
              }`}
            >
              {tab === "upcoming"
                ? `Upcoming (${upcoming.length})`
                : `Past (${past.length})`}
            </button>
          ))}
        </div>

        {/* ── Timeline container ──────────────────────────────── */}
        <div ref={timelineRef} className="relative min-h-[200px]">
          {/* SVG chain axis */}
          {chainHeight > 0 && (
            <svg
              className="absolute left-[11px] md:left-1/2 md:-translate-x-px top-0 pointer-events-none z-0"
              width="2"
              height={chainHeight}
              viewBox={`0 0 2 ${chainHeight}`}
              preserveAspectRatio="none"
            >
              {/* Background track */}
              <path
                d={`M 1 0 L 1 ${chainHeight}`}
                stroke="rgba(74,222,128,0.08)"
                strokeWidth="2"
                fill="none"
              />
              {/* Scroll-animated fill */}
              <motion.path
                d={`M 1 0 L 1 ${chainHeight}`}
                stroke="rgba(74,222,128,0.3)"
                strokeWidth="2"
                fill="none"
                style={{ pathLength }}
              />
            </svg>
          )}

          {/* Event rows with AnimatePresence for tab switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "upcoming" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "upcoming" ? 20 : -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-12 md:gap-16"
            >
              {activeEvents.length > 0 ? (
                activeEvents.map((event, i) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-[24px_1fr] md:grid-cols-[1fr_48px_1fr] items-start"
                  >
                    {/* Card */}
                    <div
                      className={
                        i % 2 === 0
                          ? "col-start-2 md:col-start-1 row-start-1"
                          : "col-start-2 md:col-start-3 row-start-1"
                      }
                    >
                      <HackathonCard
                        event={event}
                        onRegister={setModalEvent}
                        isPast={isPast}
                      />
                    </div>

                    {/* Center node — pulsing dot + connector */}
                    <div className="col-start-1 md:col-start-2 row-start-1 flex flex-col items-center relative pt-8">
                      {/* Pulsing ring — simulates block confirmation */}
                      <span className="relative flex h-3 w-3 z-10">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400/40 animate-ping" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400/80 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                      </span>

                      {/* Horizontal connector — desktop only */}
                      <div
                        className={`hidden md:block absolute top-[38px] h-px ${
                          i % 2 === 0
                            ? "right-[50%] left-[-8px] bg-gradient-to-r from-transparent to-green-400/25"
                            : "left-[50%] right-[-8px] bg-gradient-to-l from-transparent to-green-400/25"
                        }`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="font-mono text-sm text-white/20">
                    No {activeTab} events.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Registration modal ───────────────────────────────── */}
      <TerminalModal
        event={modalEvent}
        onClose={() => setModalEvent(null)}
      />
    </>
  );
}