"use client";

import { useState } from "react";
import { HackathonEvent, EventMeta } from "@/data/events";
import SpotlightCard from "../ui/SpotlightCard";
import DecryptedText from "../ui/DecryptedText";
import AnimatedCounter from "../ui/AnimatedCounter";
import Magnet from "../ui/Magnet";

export type { HackathonEvent };

type Props = {
  event: HackathonEvent;
  onRegister: (e: EventMeta) => void;
  isPast?: boolean;
};

const STATUS_DOT: Record<string, string> = {
  open: "bg-green-400",
  soon: "bg-yellow-400",
  closed: "bg-white/20",
};
const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  soon: "Coming Soon",
  closed: "Ended",
};

const CHAIN_COLOR: Record<string, string> = {
  Ethereum: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Solana: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Polygon: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
};
const CHAIN_DOT: Record<string, string> = {
  Ethereum: "bg-blue-400",
  Solana: "bg-purple-400",
  Polygon: "bg-indigo-400",
};

export default function HackathonCard({ event, onRegister, isPast }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const chainStyle = event.chain
    ? CHAIN_COLOR[event.chain] ?? "text-green-400 bg-green-400/10 border-green-400/20"
    : null;
  const chainDot = event.chain
    ? CHAIN_DOT[event.chain] ?? "bg-green-400"
    : null;

  return (
    <SpotlightCard
      className={`rounded-xl border backdrop-blur-md transition-all duration-300 ${
        isPast
          ? "border-white/[0.06] bg-white/[0.02]"
          : "border-white/[0.08] bg-white/[0.04]"
      }`}
      spotlightColor={
        isPast ? "rgba(255,255,255,0.06)" : "rgba(74, 222, 128, 0.15)"
      }
    >
      {/* ── Clickable header ─────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 sm:p-6 cursor-pointer"
      >
        {/* Top row: tags + status */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {event.chain && chainStyle && (
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${chainStyle}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${chainDot}`} />
                {event.chain}
              </span>
            )}
            {event.tags.map((tag) => (
              <span
                key={tag}
                className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isPast
                    ? "text-white/20 border-white/[0.06]"
                    : "text-white/40 border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[event.status]}`} />
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  isPast ? "text-white/20" : "text-white/40"
                }`}
              >
                {STATUS_LABEL[event.status]}
              </span>
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={`transition-transform duration-300 ${
                expanded ? "rotate-180 text-green-400/60" : "text-white/20"
              }`}
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title — DecryptedText on viewport entry */}
        <h3
          className={`text-lg sm:text-xl font-bold leading-tight mb-1 ${
            isPast ? "text-white/40" : "text-white"
          }`}
        >
          <DecryptedText
            text={event.title}
            speed={40}
            maxIterations={8}
            className={isPast ? "text-white/40" : "text-white"}
            encryptedClassName="text-green-400/60"
          />
        </h3>
        <p className={`text-sm leading-relaxed ${isPast ? "text-white/20" : "text-white/40"}`}>
          {event.subtitle}
        </p>

        {/* Metadata row — monospace */}
        <div
          className={`flex flex-wrap gap-x-5 gap-y-1.5 mt-4 font-mono text-xs ${
            isPast ? "text-white/15" : "text-white/30"
          }`}
        >
          <span>{event.date}</span>
          <span>{event.location}</span>
          <span>{event.teamMin}–{event.teamMax} members</span>
        </div>
      </button>

      {/* ── Expandable details ────────────────────────────────── */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 flex flex-col gap-5 border-t border-white/[0.04]">
            {/* Description */}
            <p className={`text-sm leading-relaxed ${isPast ? "text-white/30" : "text-white/50"}`}>
              {event.description}
            </p>

            {/* Schedule — accordion, collapsed by default */}
            {event.agenda.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScheduleOpen((v) => !v);
                  }}
                  className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-green-400/50 hover:text-green-400/80 transition-colors mb-1 cursor-pointer"
                >
                  Schedule
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={`transition-transform duration-200 ${scheduleOpen ? "rotate-90" : ""}`}
                  >
                    <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: scheduleOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-1.5 pt-2">
                      {event.agenda.map((a, i) => (
                        <div key={i} className="flex items-baseline gap-4 text-sm">
                          <span className="font-mono text-[11px] text-green-400/40 w-28 shrink-0">
                            {a.time}
                          </span>
                          <span className={isPast ? "text-white/30" : "text-white/50"}>
                            {a.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prize — AnimatedCounter */}
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-400/50 mb-3">
                Prize Pool
              </p>
              <span
                className={`inline-flex items-center gap-2 font-mono text-sm font-semibold px-3 py-1.5 rounded-md border ${
                  isPast
                    ? "text-white/25 bg-white/[0.02] border-white/[0.05]"
                    : "text-yellow-400/80 bg-yellow-400/[0.06] border-yellow-400/15"
                }`}
              >
                <AnimatedCounter text={event.prize} />
              </span>
            </div>

            {/* Sponsors */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-400/50 mb-3">
                  Sponsors
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {event.sponsors.map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${
                        isPast
                          ? "text-white/20 bg-white/[0.01] border-white/[0.04]"
                          : "text-white/40 bg-white/[0.03] border-white/[0.06]"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-white/[0.04] gap-4">
        <span className="font-mono text-[11px] text-white/20 truncate">
          {event.chain ? `${event.chain} · ` : ""}
          {event.teamMin}–{event.teamMax} members
        </span>

        {isPast ? (
          <span className="font-mono text-[11px] text-white/15 px-4 py-1.5">
            Event ended
          </span>
        ) : (
          <Magnet>
            <button
              disabled={event.status === "closed"}
              onClick={(e) => {
                e.stopPropagation();
                onRegister({
                  id: event.id,
                  title: event.title,
                  teamMin: event.teamMin,
                  teamMax: event.teamMax,
                });
              }}
              className="px-4 py-1.5 bg-green-400 text-black font-mono text-xs font-bold rounded-md hover:bg-green-300 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            >
              Register →
            </button>
          </Magnet>
        )}
      </div>
    </SpotlightCard>
  );
}