"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { registerForEvent } from "@/app/actions/register";

type Props = {
  eventName: string;
  onClose: () => void;
};

type Line =
  | { type: "output" | "error" | "success" | "system"; text: string }
  | { type: "input"; text: string };

const STEPS = [
  { field: "name", prompt: "> Enter your name" },
  { field: "email", prompt: "> Enter your email" },
  { field: "college", prompt: "> Enter your college (or type none)" },
  { field: "year", prompt: "> Enter your graduation year (or type none)" },
];

function validate(field: string, value: string): string | null {
  if (!value.trim()) return "Field cannot be empty.";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Invalid email address formatting.";
  return null;
}

const lineColor: Record<string, string> = {
  system: "text-white/30",
  output: "text-white/75",
  error: "text-red-400",
  success: "text-green-400",
  input: "text-lime-400",
};

export default function RegistrationTerminal({ eventName, onClose }: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "confirm" | "submitting" | "done">("form");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const push = useCallback((line: Line) => setLines((l) => [...l, line]), []);

  useEffect(() => {
    setLines([]);
    setStepIdx(0);
    setData({});
    setPhase("form");
    setInput("");

    const boot = [
      { type: "system" as const, text: "Sovereign Network Terminal v1.0.0 — Event Registration Shell" },
      { type: "system" as const, text: "Establishing secure connection..." },
      { type: "success" as const, text: `Connection established. Session UUID: ${crypto.randomUUID?.() || '000000-0000'}` },
      { type: "output" as const, text: "───────────────────────────────────────" },
      { type: "output" as const, text: "Follow the prompts to register." },
      { type: "output" as const, text: "Type 'help' for commands or 'exit' to abort." },
      { type: "output" as const, text: "───────────────────────────────────────" },
      { type: "output" as const, text: "" },
    ];

    let delay = 0;
    boot.forEach((line) => {
      delay += 120;
      setTimeout(() => push(line), delay);
    });

    setTimeout(() => {
      push({ type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` });
      inputRef.current?.focus();
    }, delay + 200);
  }, [push]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      push({ type: "input", text: `$ ${cmd}` });
      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      setInput("");

      if (!cmd && phase !== "submitting") return;

      if (cmd === "exit" || cmd === "quit" || cmd === "abort") {
        onClose();
        return;
      }
      if (cmd === "clear") {
        setLines([]);
        return;
      }
      if (cmd === "help") {
        ["Available commands:", "  help — show this manual", "  clear — clear terminal buffer",
         "  exit/abort/quit — close terminal", "  restart — start over", "  status — view staged payload"
        ].forEach((t) => push({ type: "output", text: t }));
        return;
      }
      if (cmd === "restart") {
        setStepIdx(0);
        setData({});
        setPhase("form");
        push({ type: "system", text: "flushing buffers... restarted." });
        push({ type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` });
        return;
      }
      if (cmd === "status") {
        push({ type: "output", text: "── Staged Payload ──" });
        Object.entries(data).forEach(([k, v]) => push({ type: "output", text: `  ${k}: "${v}"` }));
        if (!Object.keys(data).length) push({ type: "output", text: "  (empty)" });
        return;
      }

      if (phase === "confirm") {
        if (["yes", "y"].includes(cmd.toLowerCase())) {
          setPhase("submitting");
          push({ type: "system", text: "Initiating secure handshake..." });

          if (!turnstileToken) {
            push({ type: "error", text: "✗ CAPTCHA not completed or still verifying. Wait a moment and type 'yes' again." });
            setPhase("confirm");
            return;
          }

          push({ type: "system", text: "Transmitting payload..." });

          const payload = {
            name: data.name,
            email: data.email,
            college: data.college,
            year: data.year,
            event: eventName,
          };

          const res = await registerForEvent(payload, turnstileToken);

          if (res.success) {
            setPhase("done");
            push({ type: "success", text: "✓ REGISTRATION SUCCESSFUL" });
            push({ type: "output", text: "  Your credentials have been securely logged." });
            push({ type: "system", text: "  Session terminating. Type 'exit' to continue." });
          } else {
            push({ type: "error", text: `✗ TRANSMISSION FAILED: ${res.error}` });
            setPhase("confirm");
            push({ type: "output", text: "Retry submission? [yes / no]" });
          }
        } else if (["no", "n"].includes(cmd.toLowerCase())) {
          setStepIdx(0);
          setData({});
          setPhase("form");
          push({ type: "output", text: "Execution aborted. Restarting..." });
          push({ type: "output", text: `[Step 1/${STEPS.length}] ${STEPS[0].prompt}:` });
        } else {
          push({ type: "error", text: "Unrecognized instruction. Expected 'yes' or 'no'." });
        }
        return;
      }

      if (phase === "done" || phase === "submitting") {
        if (phase === "done") {
          push({ type: "error", text: "Session terminated. Type 'exit' to close prompt." });
        } else {
          push({ type: "error", text: "Transmission in progress. Please wait..." });
        }
        return;
      }

      const step = STEPS[stepIdx];
      const err = validate(step.field, cmd);
      if (err) {
        push({ type: "error", text: `✗ ${err}` });
        push({ type: "output", text: `[Step ${stepIdx + 1}/${STEPS.length}] ${step.prompt}:` });
        return;
      }

      const newData = { ...data, [step.field]: cmd };
      setData(newData);
      push({ type: "success", text: "  ✓ Saved to buffer." });

      const next = stepIdx + 1;
      if (next < STEPS.length) {
        setStepIdx(next);
        push({ type: "output", text: "" });
        push({ type: "output", text: `[Step ${next + 1}/${STEPS.length}] ${STEPS[next].prompt}:` });
      } else {
        setPhase("confirm");
        push({ type: "output", text: "" });
        push({ type: "output", text: "─── PAYLOAD READY FOR TRANSMISSION ───" });
        push({ type: "output", text: `  EVENT    : ${eventName}` });
        STEPS.forEach((s) => {
          push({ type: "output", text: `  ${s.field.toUpperCase().padEnd(8, " ")} : ${newData[s.field]}` });
        });
        push({ type: "output", text: "──────────────────────────────────────" });
        push({ type: "output", text: "Authorize transmission? [yes / no]" });
      }
    },
    [data, onClose, phase, push, stepIdx, turnstileToken]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(ni);
      setInput(history[ni] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni);
      setInput(ni === -1 ? "" : history[ni]);
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl h-[600px] bg-[#0a0c0f] border border-green-500/20 rounded-xl flex flex-col shadow-[0_0_80px_rgba(34,197,94,0.1)] font-mono text-sm overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/10 bg-white/[0.02] shrink-0">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:brightness-125 transition-all outline-none"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="flex-1 text-center text-white/30 text-xs tracking-wider">
            root@sovereign: ~/register
          </span>
        </div>

        {/* Output */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={`leading-relaxed whitespace-pre-wrap ${lineColor[l.type]}`}
            >
              {l.text}
            </div>
          ))}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Turnstile Widget (hidden but active) */}
        <div className="hidden">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
            onSuccess={(token) => setTurnstileToken(token)}
            options={{
              theme: "dark",
              size: "invisible",
            }}
          />
        </div>

        {/* Input */}
        {phase !== "submitting" && (
          <div className="flex items-center gap-3 px-6 py-4 border-t border-green-500/10 shrink-0 bg-white/[0.01]">
            <span className="text-green-400 font-bold">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="awaiting command..."
              autoComplete="off"
              spellCheck={false}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-lime-400 placeholder-white/20 caret-green-400 font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
