"use client";

import { useState } from "react";
import { EventMeta } from "./terminalModal";

export type HackathonEvent = EventMeta & {
  subtitle:   string;
  date:       string;
  location:   string;
  prize:      string;
  tags:       string[];
  description:string;
  agenda:     { time: string; item: string }[];
  sponsors?:  string[];
  status:     "open" | "soon" | "closed";
};

type Props = {
  event:      HackathonEvent;
  onRegister: (e: EventMeta) => void;
};

const statusStyle: Record<string, string> = {
  open:   "text-green-400 bg-green-400/10 border-green-400/30",
  soon:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  closed: "text-red-400  bg-red-400/10  border-red-400/30",
};
const statusLabel: Record<string, string> = {
  open:   "Registration Open",
  soon:   "Coming Soon",
  closed: "Closed",
};

export default function HackathonCard({ event, onRegister }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden hover:border-green-500/25 hover:shadow-xl transition-all duration-300">

      {/* Clickable header */}
      <div
        className="p-6 cursor-pointer grid gap-4"
        style={{ gridTemplateColumns: "1fr auto" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.tags.map((tag, i) => (
              <span
                key={tag}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  i % 2 === 0
                    ? "text-green-400 bg-green-400/8 border-green-400/20"
                    : "text-yellow-400 bg-yellow-400/8 border-yellow-400/20"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-extrabold text-white mb-1 leading-tight">{event.title}</h3>
          <p className="text-sm text-white/40">{event.subtitle}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${statusStyle[event.status]}`}
          >
            {statusLabel[event.status]}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`text-white/30 transition-transform duration-300 ${expanded ? "rotate-180 text-green-400" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Always-visible info row */}
      <div className="flex flex-wrap gap-5 px-6 pb-4 border-b border-white/5">
        {[
          { icon: "📅", text: event.date },
          { icon: "📍", text: event.location },
          { icon: "👥", text: `${event.teamMin}–${event.teamMax} members` },
          { icon: "🏆", text: event.prize },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-1.5 font-mono text-xs text-white/45">
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="px-6 py-5 flex flex-col gap-5 border-b border-white/5">
          <p className="text-sm text-white/60 leading-relaxed">{event.description}</p>

          {/* Agenda */}
          {event.agenda.length > 0 && (
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-400 mb-3">
                // Schedule
              </p>
              <div className="flex flex-col gap-2">
                {event.agenda.map((a, i) => (
                  <div key={i} className="flex items-baseline gap-4 text-sm">
                    <span className="font-mono text-xs text-green-400/70 w-24 shrink-0">{a.time}</span>
                    <span className="text-white/60">{a.item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prize */}
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-400 mb-3">
              // Prize Pool
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-yellow-400 bg-yellow-400/8 border border-yellow-400/20 px-4 py-2 rounded-lg">
              🏆 {event.prize}
            </span>
          </div>

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-400 mb-3">
                // Sponsors
              </p>
              <div className="flex flex-wrap gap-2">
                {event.sponsors.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-xs text-white/45 bg-white/5 border border-white/8 px-3 py-1.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
        <span className="font-mono text-xs text-white/35">
          Team size: {event.teamMin}–{event.teamMax} · {event.location}
        </span>
        <button
          disabled={event.status === "closed"}
          onClick={() =>
            onRegister({ id: event.id, title: event.title, teamMin: event.teamMin, teamMax: event.teamMax })
          }
          className="px-5 py-2 bg-green-400 text-black font-mono text-xs font-bold rounded-md hover:bg-green-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {event.status === "closed" ? "Registration Closed" : "Register →"}
        </button>
      </div>
    </div>
  );
}