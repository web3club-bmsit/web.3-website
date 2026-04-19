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
// UPCOMING EVENTS (dates after today — April 2026)
// ─────────────────────────────────────────────────────────────

const UPCOMING: HackathonEvent[] = [
  {
    id: "eth-build-weekend",
    title: "ETH Build Weekend",
    subtitle: "48-hour smart contract & dApp hackathon on L2s",
    date: "May 24–26, 2026",
    startDate: "2026-05-24T09:00:00Z",
    location: "Main Campus · Auditorium A",
    prize: "₹2,00,000 Prize Pool",
    tags: ["Hackathon", "Ethereum", "48h"],
    teamMin: 2,
    teamMax: 4,
    status: "open",
    chain: "Ethereum",
    description:
      "Ship a working dApp or smart contract in 48 hours. Build on any Ethereum L2 — Optimism, Arbitrum, Base, or mainnet. Judged by protocol engineers. Gas fees covered for testnet deployments. Meals, snacks, and caffeine provided.",
    agenda: [
      { time: "May 24 09:00", item: "Opening Ceremony & Track Reveal" },
      { time: "May 24 10:00", item: "Hacking Begins" },
      { time: "May 24 18:00", item: "Workshop: Intro to Foundry & Hardhat" },
      { time: "May 25 14:00", item: "Mid-way Check-in with Mentors" },
      { time: "May 26 09:00", item: "Code Freeze & Submissions" },
      { time: "May 26 11:00", item: "Demo Day & Judging" },
      { time: "May 26 15:00", item: "Prize Distribution" },
    ],
    sponsors: ["Ethereum Foundation", "Alchemy", "Base", "Chainlink"],
  },
  {
    id: "defi-protocol-challenge",
    title: "DeFi Protocol Challenge",
    subtitle: "Build a DeFi primitive — AMM, lending, or vault",
    date: "Jun 14–15, 2026",
    startDate: "2026-06-14T09:00:00Z",
    location: "Online + Campus Satellite",
    prize: "₹75,000 Prize Pool",
    tags: ["Hackathon", "DeFi", "24h"],
    teamMin: 1,
    teamMax: 3,
    status: "open",
    chain: "Polygon",
    description:
      "Design and deploy a DeFi primitive on Polygon testnet. Think AMMs, lending protocols, yield vaults, or something entirely new. Bonus points for novel tokenomics. Starter templates provided.",
    agenda: [
      { time: "Jun 14 10:00", item: "Kickoff & DeFi Primer" },
      { time: "Jun 14 12:00", item: "Workshop: Building with Uniswap V4 Hooks" },
      { time: "Jun 14 18:00", item: "Office Hours with Mentors" },
      { time: "Jun 15 10:00", item: "Submissions Close" },
      { time: "Jun 15 13:00", item: "Demos & Judging" },
    ],
    sponsors: ["Polygon", "Aave", "The Graph"],
  },
  {
    id: "zk-proof-workshop",
    title: "ZK Proof Workshop",
    subtitle: "Hands-on intro to zero-knowledge proofs with Circom",
    date: "Jul 5, 2026",
    startDate: "2026-07-05T10:00:00Z",
    location: "Lab 204 · CS Building",
    prize: "Certificates + Swag",
    tags: ["Workshop", "ZK", "Cryptography"],
    teamMin: 1,
    teamMax: 1,
    status: "soon",
    chain: "Ethereum",
    description:
      "Go from zero to ZK in one day. Learn the math behind SNARKs, write your first Circom circuit, generate & verify proofs on-chain. No prior cryptography experience needed — just bring your laptop and curiosity.",
    agenda: [
      { time: "10:00", item: "Why ZK? — The Big Picture" },
      { time: "11:00", item: "Circom 101 — Writing Your First Circuit" },
      { time: "13:00", item: "Lunch Break" },
      { time: "14:00", item: "Generating Proofs with snarkjs" },
      { time: "15:30", item: "On-chain Verification on Sepolia" },
      { time: "16:30", item: "Q&A & Wrap-up" },
    ],
    sponsors: ["PSE (Privacy & Scaling Explorations)"],
  },
  {
    id: "dao-governance-jam",
    title: "DAO Governance Jam",
    subtitle: "Build governance contracts + a Snapshot-style frontend",
    date: "Jul 19–20, 2026",
    startDate: "2026-07-19T09:00:00Z",
    location: "Online",
    prize: "₹40,000 + DAO Tooling Credits",
    tags: ["Workshop", "DAO", "Governance"],
    teamMin: 2,
    teamMax: 3,
    status: "soon",
    description:
      "Design a governance system from scratch. Write the Solidity contracts (Governor, Timelock, Token), build a React frontend for proposals & voting, and deploy it all. Best governance UX wins.",
    agenda: [
      { time: "Jul 19 10:00", item: "Intro to On-chain Governance" },
      { time: "Jul 19 11:30", item: "Smart Contract Workshop" },
      { time: "Jul 19 15:00", item: "Frontend Sprint Begins" },
      { time: "Jul 20 12:00", item: "Submissions & Demos" },
    ],
    sponsors: ["Tally", "Snapshot"],
  },
  {
    id: "nft-art-drop",
    title: "NFT Art Drop",
    subtitle: "On-chain generative art — mint, showcase, trade",
    date: "Aug 8, 2026",
    startDate: "2026-08-08T11:00:00Z",
    location: "Art Lab · Creative Wing",
    prize: "Featured Gallery + 0.5 ETH",
    tags: ["Community", "NFT", "Art"],
    teamMin: 1,
    teamMax: 1,
    status: "open",
    chain: "Ethereum",
    description:
      "Create generative art that lives on-chain. Use p5.js, Processing, or any tool — the output gets minted as an NFT on our club contract. Top pieces displayed in the campus gallery for a month. Open to artists and coders alike.",
    agenda: [
      { time: "11:00", item: "Intro to On-chain Generative Art" },
      { time: "12:00", item: "Create Sprint — Build Your Piece" },
      { time: "15:00", item: "Minting Session" },
      { time: "16:00", item: "Gallery Walk & Voting" },
      { time: "17:00", item: "Winners Announced" },
    ],
    sponsors: ["Art Blocks", "OpenSea"],
  },
];

// ─────────────────────────────────────────────────────────────
// PAST EVENTS (dates before today)
// ─────────────────────────────────────────────────────────────

const PAST: HackathonEvent[] = [
  {
    id: "web3-security-ctf",
    title: "Web3 Security CTF",
    subtitle: "Exploit intentionally-vulnerable Solidity contracts",
    date: "Mar 15, 2026",
    startDate: "2026-03-15T00:00:00Z",
    location: "Online",
    prize: "₹30,000 + Internship Referrals",
    tags: ["CTF", "Security", "Solidity"],
    teamMin: 1,
    teamMax: 3,
    status: "closed",
    chain: "Ethereum",
    description:
      "Find and exploit vulnerabilities in 12 intentionally-broken Solidity contracts. Reentrancy, flash loan attacks, access control bugs, price oracle manipulation — all fair game. Beginner track included.",
    agenda: [
      { time: "Mar 15 00:00", item: "CTF Goes Live" },
      { time: "Mar 15 23:59", item: "Submissions Close" },
      { time: "Mar 16 14:00", item: "Solution Walkthroughs Published" },
    ],
    sponsors: ["OpenZeppelin", "Immunefi"],
  },
  {
    id: "solana-speedrun",
    title: "Solana Speedrun",
    subtitle: "Ship an Anchor program in 6 hours",
    date: "Feb 8, 2026",
    startDate: "2026-02-08T10:00:00Z",
    location: "Main Campus · Room 101",
    prize: "₹50,000 Prize Pool",
    tags: ["Hackathon", "Solana", "Speedrun"],
    teamMin: 1,
    teamMax: 2,
    status: "closed",
    chain: "Solana",
    description:
      "The clock starts at 10 AM. You have 6 hours to build and deploy a working Anchor program on Solana devnet. Any idea goes — tokens, NFTs, DeFi, games. Fastest functional deploy wins bonus points.",
    agenda: [
      { time: "10:00", item: "Start — Hacking Begins" },
      { time: "13:00", item: "Checkpoint with Mentors" },
      { time: "16:00", item: "Code Freeze" },
      { time: "16:30", item: "Lightning Demos" },
      { time: "17:30", item: "Results & Prizes" },
    ],
    sponsors: ["Solana Foundation", "Helius"],
  },
  {
    id: "consensus-conf-25",
    title: "Consensus Conference '25",
    subtitle: "Talks on MEV, rollups, account abstraction & more",
    date: "Dec 12, 2025",
    startDate: "2025-12-12T09:00:00Z",
    location: "Online + Campus Satellite",
    prize: "Swag + Certificates",
    tags: ["Summit", "Conference", "Blockchain"],
    teamMin: 1,
    teamMax: 1,
    status: "closed",
    description:
      "A full-day conference featuring talks from protocol researchers and engineers. Topics covered: MEV & PBS, rollup economics, ERC-4337 account abstraction, cross-chain bridges, and the future of Ethereum governance.",
    agenda: [
      { time: "09:30", item: "Keynote: The State of Ethereum 2025" },
      { time: "11:00", item: "Talk: MEV Supply Chain & PBS" },
      { time: "13:00", item: "Lunch & Networking" },
      { time: "14:00", item: "Panel: Rollup Wars — Optimistic vs ZK" },
      { time: "15:30", item: "Workshop: Building with ERC-4337" },
      { time: "17:00", item: "Closing Remarks" },
    ],
    sponsors: ["Flashbots", "Scroll", "Biconomy"],
  },
];

// ─────────────────────────────────────────────────────────────
// Combined & sorted (newest first)
// ─────────────────────────────────────────────────────────────

export const EVENTS: HackathonEvent[] = [...UPCOMING, ...PAST].sort(
  (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
);
