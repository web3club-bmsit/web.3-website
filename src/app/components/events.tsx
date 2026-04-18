"use client";

import { useState } from "react";
import HackathonCard, { HackathonEvent } from "./hackathon/hackathonCard";
import TerminalModal, { EventMeta } from "./hackathon/terminalModal";

// ─────────────────────────────────────────────────────────────
// MOCK DATA — replace with your API / CMS fetch
// ─────────────────────────────────────────────────────────────
const EVENTS: HackathonEvent[] = [
  {
    id: "hackx-2025",
    title: "HackX 2025",
    subtitle: "48-hour product hackathon · Build anything, ship fast",
    date: "Aug 16–18, 2025",
    location: "Main Campus · Auditorium A",
    prize: "₹1,50,000 Prize Pool",
    tags: ["Hackathon", "Open Track", "48h"],
    teamMin: 2,
    teamMax: 4,
    status: "open",
    description:
      "HackX is our flagship 48-hour hackathon where students build products from scratch. Any domain — AI, web3, hardware, social good. Judged by engineers from top product companies. Meals, snacks, and caffeine provided.",
    agenda: [
      { time: "Aug 16 9:00",  item: "Opening Ceremony & Theme Reveal" },
      { time: "Aug 16 10:00", item: "Hacking Begins" },
      { time: "Aug 17 14:00", item: "Mid-way Check-in with Mentors" },
      { time: "Aug 18 9:00",  item: "Submissions Deadline" },
      { time: "Aug 18 11:00", item: "Demos & Judging" },
      { time: "Aug 18 15:00", item: "Prize Distribution" },
    ],
    sponsors: ["Vercel", "Supabase", "Figma", "GitHub"],
  },
  {
    id: "devtalk-summit",
    title: "DevTalk Summit",
    subtitle: "Full-day developer conference · Talks, workshops & networking",
    date: "Sep 7, 2025",
    location: "Online + Campus Satellite",
    prize: "Swag + Certificates",
    tags: ["Summit", "Conference", "Workshops"],
    teamMin: 1,
    teamMax: 1,
    status: "soon",
    description:
      "DevTalk Summit brings together student developers and industry engineers for a full day of technical talks, hands-on workshops, and structured networking. Topics span systems, AI infra, open-source, and career development.",
    agenda: [
      { time: "09:30", item: "Keynote: State of Developer Tooling 2025" },
      { time: "11:00", item: "Workshop Track A: Ship with Next.js 15" },
      { time: "11:00", item: "Workshop Track B: LLM Fine-tuning 101" },
      { time: "14:00", item: "Panel: Open Source Careers" },
      { time: "16:00", item: "Networking Mixer" },
    ],
    sponsors: ["AWS", "JetBrains"],
  },
  {
    id: "ctf-autumn",
    title: "Autumn CTF",
    subtitle: "Capture the Flag · Security & reverse engineering challenge",
    date: "Oct 12, 2025",
    location: "Online",
    prize: "₹30,000 + Internship Referrals",
    tags: ["CTF", "Security", "Solo/Team"],
    teamMin: 1,
    teamMax: 3,
    status: "closed",
    description:
      "Autumn CTF is our annual security-focused competition. Solve challenges in web exploitation, binary reversing, cryptography, and forensics. All skill levels welcome — beginner track included.",
    agenda: [
      { time: "Oct 12 00:00", item: "Competition Live" },
      { time: "Oct 12 23:59", item: "Submissions Close" },
      { time: "Oct 13 12:00", item: "Solution Walkthroughs Published" },
    ],
    sponsors: ["HackerOne"],
  },
];

const FILTERS = ["All", "Hackathon", "Summit", "CTF", "Workshop"];

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalEvent,   setModalEvent]   = useState<EventMeta | null>(null);

  const filtered =
    activeFilter === "All"
      ? EVENTS
      : EVENTS.filter((e) =>
          e.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()))
        );

  return (
    <>
      <section id="events" className="max-w-4xl mx-auto px-6 py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-green-400 mb-3">
          // events &amp; competitions
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          What's happening
        </h2>
        <p className="text-base text-white/40 max-w-lg leading-relaxed mb-10">
          Hackathons, summits, and challenges — built for students who ship.
          Expand a card to see full details, then register from the terminal.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-mono text-xs font-bold px-4 py-1.5 rounded-full border transition-colors ${
                activeFilter === f
                  ? "text-green-400 bg-green-400/10 border-green-400/40"
                  : "text-white/40 border-white/10 hover:text-green-400 hover:border-green-400/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p className="text-center py-16 font-mono text-sm text-white/25">
              No events found for "{activeFilter}".
            </p>
          ) : (
            filtered.map((e) => (
              <HackathonCard key={e.id} event={e} onRegister={setModalEvent} />
            ))
          )}
        </div>
      </section>

      <TerminalModal event={modalEvent} onClose={() => setModalEvent(null)} />
    </>
  );
}