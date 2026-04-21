"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENTS } from "@/data/events";
import RegistrationTerminal from "./RegistrationTerminal";
import { ArrowRight } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";
import { useTheme } from "next-themes";

export default function UpcomingEventHome() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const handleRegister = (eventName: string) => {
    setSelectedEvent(eventName);
    setShowTerminal(true);
  };

  return (
    <section
      className={`relative w-full py-40 px-8 lg:px-16 flex items-center justify-center min-h-[900px] z-20 mt-24 overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#08080c]" : "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
      }`}
    >
      {/* Decorative glow blobs in light mode */}
      {!isDark && (
        <>
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side text */}
        <div className="flex flex-col items-start text-left z-30 mb-20 lg:mb-0">
          <h2
            className={`text-5xl lg:text-7xl font-black mb-6 ${
              isDark
                ? "text-white"
                : "bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent"
            }`}
          >
            Flagship<br />Events
          </h2>
          <p className={`text-xl max-w-md ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Card stacks have never looked so good. Discover our premier hackathons, workshops, and exclusive summits shifting the frontier of Web3.
          </p>
        </div>

        {/* Right Side Cards */}
        <div className="relative w-full flex justify-center lg:justify-end py-10 pointer-events-auto">
          <CardSwap
            width={600}
            height={480}
            cardDistance={50}
            verticalDistance={50}
            delay={2000}
            pauseOnHover={true}
            skewAmount={4}
          >
            {EVENTS.map((event) => {
              const isUpcoming = new Date(event.startDate).getTime() > Date.now();
              return (
                <Card
                  key={event.id}
                  className={`flex flex-col justify-between p-0 overflow-hidden ${
                    isDark
                      ? "shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                      : "shadow-[0_30px_60px_rgba(99,102,241,0.15)] border border-indigo-100"
                  }`}
                >
                  <img
                    src="/placeholder-event.png"
                    alt="Event placeholder"
                    className={`w-full h-36 object-cover border-b ${isDark ? "border-white/10" : "border-indigo-100"}`}
                  />

                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest ${
                            isDark
                              ? "border-green-400/20 bg-green-400/5 text-green-400"
                              : "border-indigo-300/40 bg-indigo-50 text-indigo-600"
                          }`}
                        >
                          {isUpcoming ? (
                            <>
                              <span
                                className={`w-2 h-2 rounded-full animate-ping ${isDark ? "bg-green-400" : "bg-indigo-500"}`}
                              />
                              Upcoming Event
                            </>
                          ) : (
                            "Past Event"
                          )}
                        </div>
                        <span className={`font-mono text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          {event.date}
                        </span>
                      </div>

                      <h2 className={`text-3xl font-black leading-tight mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                        {event.title}
                      </h2>
                      <p className={`text-sm line-clamp-2 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                        {event.description}
                      </p>
                    </div>

                    {isUpcoming && (
                      <div className="flex flex-col gap-3 mt-6">
                        <button
                          onClick={() => handleRegister(event.title)}
                          className={`px-6 py-3 w-full font-bold rounded-lg transition-all flex items-center justify-center gap-2 group ${
                            isDark
                              ? "bg-green-400 text-black hover:bg-green-300"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_4px_14px_rgba(99,102,241,0.4)]"
                          }`}
                        >
                          Register for the event <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <Link
                          href="/events"
                          className={`px-6 py-3 w-full border font-bold rounded-lg transition-all flex items-center justify-center ${
                            isDark
                              ? "border-white/10 text-white hover:bg-white/5"
                              : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          }`}
                        >
                          Explore all events
                        </Link>
                      </div>
                    )}

                    {!isUpcoming && (
                      <div className="flex flex-col gap-3 mt-6">
                        <Link
                          href="/events"
                          className={`px-6 py-3 w-full font-bold rounded-lg transition-all flex items-center justify-center ${
                            isDark
                              ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                          }`}
                        >
                          Read Recap
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </CardSwap>
        </div>
      </div>

      {showTerminal && (
        <RegistrationTerminal eventName={selectedEvent} onClose={() => setShowTerminal(false)} />
      )}
    </section>
  );
}
