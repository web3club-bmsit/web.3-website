// ─────────────────────────────────────────────────────────────
// Event types & mock data for Web3 club events
// All event data lives here — never hardcode inside UI components
// ─────────────────────────────────────────────────────────────

// Registration modal only needs these 4 fields — kept minimal deliberately
export type EventMeta = {
  id: string;
  title: string;
  teamMin: number;
  teamMax: number;
};

// A single schedule entry — extracted so it's not repeated inline everywhere
export type AgendaItem = {
  time: string;
  item: string;
};

// Full event shape — extends EventMeta so id/title/teamMin/teamMax
// only live in one place. Change EventMeta → change propagates here too.
export type HackathonEvent = EventMeta & {
  subtitle: string;
  date: string;        // human-readable display string e.g. "May 24–26, 2026"
  startDate: string;   // ISO — used to split upcoming vs past programmatically
  location: string;
  prize: string;
  tags: string[];
  description: string;
  agenda: AgendaItem[];
  sponsors?: string[];
  status: "open" | "soon" | "closed";
  chain?: string;      // e.g. "Ethereum", "Solana", "Polygon"
  imageUrl?: string;
};

export const FILTERS = [
  "All",
  "Hackathon",
  "Workshop",
  "CTF",
  "Summit",
  "Community",
];

// ─────────────────────────────────────────────────────────────
// No more mock data — all events are fetched from Supabase.
// Types kept here for legacy components that rely on them.
// ─────────────────────────────────────────────────────────────
