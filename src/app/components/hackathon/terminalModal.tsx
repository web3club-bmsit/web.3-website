"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type EventMeta = {
  id: string;
  title: string;
  teamMin: number;
  teamMax: number;
};

type Props = {
  event: EventMeta | null;
  onClose: () => void;
};

type Line =
  | { type: "output" | "error" | "success" | "system"; text: string }
  | { type: "input"; text: string };

const STEPS = [
  { field: "teamName", prompt: "Enter team name" },
  { field: "members",  prompt: "Enter member names (comma-separated)" },
  { field: "email",    prompt: "Enter team lead email" },
  { field: "college",  prompt: "Enter college / institution" },
];

function validate(field: string, value: string): string | null {
  if (!value.trim()) return "Field cannot be empty.";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Invalid email address.";
  return null;
}

async function fakeSubmit(): Promise<string> {
  return new Promise((res) =>
    setTimeout(() => res(`REG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`), 1200)
  );
}

const lineColor: Record<string, string> = {
  system:  "text-white/30",
  output:  "text-white/75",
  error:   "text-red-400",
  success: "text-green-400",
  input:   "text-lime-400",
};

export default function TerminalModal({ event, onClose }: Props) {
  const [lines,    setLines]   = useState<Line[]>([]);
  const [input,    setInput]   = useState("");
  const [stepIdx,  setStepIdx] = useState(0);
  const [data,     setData]    = useState<Record<string, string>>({});
  const [phase,    setPhase]   = useState<"form" | "confirm" | "submitting" | "done">("form");
  const [history,  setHistory] = useState<string[]>([]);
  const [histIdx,  setHistIdx] = useState(-1);
  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const push = useCallback((line: Line) => setLines((l) => [...l, line]), []);

  useEffect(() => {
    if (!event) return;
    setLines([]); setStepIdx(0); setData({}); setPhase("form"); setInput("");

    const boot = [
      { type: "system"  as const, text: "ClubOS Terminal v2.4.1 — Registration Shell" },
      { type: "system"  as const, text: "Connecting to event server..." },
      { type: "success" as const, text: `Connected. Session: ${Math.random().toString(36).slice(2, 10)}` },
      { type: "output"  as const, text: "─────────────────────────────────────" },
      { type: "output"  as const, text: `EVENT : ${event.title}` },
      { type: "output"  as const, text: `TEAM  : ${event.teamMin}–${event.teamMax} members` },
      { type: "output"  as const, text: "─────────────────────────────────────" },
      { type: "output"  as const, text: "Type 'help' for commands. 'exit' to quit." },
      { type: "output"  as const, text: "" },
    ];

    let delay = 0;
    boot.forEach((line) => {
      delay += 140;
      setTimeout(() => setLines((l) => [...l, line]), delay);
    });
    setTimeout(() => {
      setLines((l) => [...l, { type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` }]);
      inputRef.current?.focus();
    }, delay + 200);
  }, [event]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      push({ type: "input", text: `$ ${cmd}` });
      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      setInput("");
      if (!cmd) return;

      if (cmd === "exit" || cmd === "quit") { onClose(); return; }
      if (cmd === "clear") { setLines([]); return; }
      if (cmd === "help") {
        ["Available commands:", "  help — show this", "  clear — clear terminal",
         "  exit — close", "  restart — restart", "  status — show entered data",
        ].forEach((t) => push({ type: "output", text: t }));
        return;
      }
      if (cmd === "restart") {
        setStepIdx(0); setData({}); setPhase("form");
        push({ type: "system", text: "Restarting..." });
        push({ type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` });
        return;
      }
      if (cmd === "status") {
        push({ type: "output", text: "── Entered data ──" });
        Object.entries(data).forEach(([k, v]) => push({ type: "output", text: `  ${k}: ${v}` }));
        if (!Object.keys(data).length) push({ type: "output", text: "  (none yet)" });
        return;
      }

      if (phase === "confirm") {
        if (["yes", "y"].includes(cmd.toLowerCase())) {
          setPhase("submitting");
          push({ type: "system", text: "Submitting registration..." });
          fakeSubmit().then((id) => {
            setPhase("done");
            push({ type: "success", text: "✓ Registration successful!" });
            push({ type: "success", text: `  Confirmation ID : ${id}` });
            push({ type: "output",  text: "  Check your email for details." });
            push({ type: "output",  text: "Type 'exit' to close." });
          });
        } else if (["no", "n"].includes(cmd.toLowerCase())) {
          setStepIdx(0); setData({}); setPhase("form");
          push({ type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` });
        } else {
          push({ type: "error", text: "Please type 'yes' or 'no'." });
        }
        return;
      }

      if (phase === "done" || phase === "submitting") {
        push({ type: "error", text: "Done. Type 'exit' or 'restart'." });
        return;
      }

      const step = STEPS[stepIdx];
      const err  = validate(step.field, cmd);
      if (err) {
        push({ type: "error",  text: `✗ ${err}` });
        push({ type: "output", text: `[Step ${stepIdx + 1}/${STEPS.length}] ${step.prompt}:` });
        return;
      }

      const newData = { ...data, [step.field]: cmd.trim() };
      setData(newData);
      push({ type: "success", text: "  ✓ Saved." });

      const next = stepIdx + 1;
      if (next < STEPS.length) {
        setStepIdx(next);
        push({ type: "output", text: "" });
        push({ type: "output", text: `[Step ${next + 1}/${STEPS.length}] ${STEPS[next].prompt}:` });
      } else {
        setPhase("confirm");
        push({ type: "output", text: "" });
        push({ type: "output", text: "─── Review your registration ───" });
        push({ type: "output", text: `  Team Name : ${newData.teamName}` });
        push({ type: "output", text: `  Members   : ${newData.members}` });
        push({ type: "output", text: `  Email     : ${newData.email}` });
        push({ type: "output", text: `  College   : ${newData.college}` });
        push({ type: "output", text: "────────────────────────────────" });
        push({ type: "output", text: "Confirm registration? [yes / no]" });
      }
    },
    [data, onClose, phase, push, stepIdx]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { handleCommand(input); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(ni); setInput(history[ni] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni); setInput(ni === -1 ? "" : history[ni]);
    }
    if (e.key === "Escape") onClose();
  };

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl h-[520px] bg-[#0a0c0f] border border-green-500/20 rounded-xl flex flex-col shadow-2xl font-mono text-sm overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/10 bg-white/[0.02] shrink-0">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:brightness-125 transition-all" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="flex-1 text-center text-white/30 text-xs tracking-wider">
            registration — {event.title.toLowerCase().replace(/\s/g, "-")}
          </span>
        </div>

        {/* Output */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${lineColor[l.type]}`}>
              {l.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {phase !== "submitting" && (
          <div className="flex items-center gap-3 px-5 py-3 border-t border-green-500/10 shrink-0">
            <span className="text-green-400">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="type here..."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent border-none outline-none text-lime-400 placeholder-white/20 caret-green-400 font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}