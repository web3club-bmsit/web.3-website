"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPublicEvents, type EventRow } from "@/app/actions/admin";
import RegistrationTerminal from "./RegistrationTerminal";
import { ArrowRight, Loader2 } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";
import { useTheme } from "next-themes";

export default function UpcomingEventHome() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicEvents().then(data => {
      setEvents(data || []);
      setIsLoading(false);
    });
  }, []);
  const { resolvedTheme } = useTheme();

  const handleRegister = (eventName: string) => {
    setSelectedEvent(eventName);
    setShowTerminal(true);
  };

  return (
    <section
      className="relative w-full py-40 px-8 lg:px-16 flex items-center justify-center min-h-[900px] z-20 overflow-hidden transition-colors duration-500 bg-background"
    >
      {/* Decorative glow blobs in light mode */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-green-200/30 rounded-full blur-3xl pointer-events-none dark:hidden" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-slate-300/30 rounded-full blur-3xl pointer-events-none dark:hidden" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="flex flex-col items-start text-left z-30 mb-20 lg:mb-0">
          <h2 className="text-5xl lg:text-7xl font-black mb-6 text-[#202221] dark:text-[#CDEF33]">
            Flagship<br />Events
          </h2>
          <p className="text-xl max-w-md text-foreground/60">
            Card stacks have never looked so good. Discover our premier hackathons, workshops, and exclusive summits shifting the frontier of Web3.
          </p>
        </div>

        {/* Right Side Cards */}
        <div className="relative w-full flex justify-center lg:justify-end py-10 pointer-events-auto">
          {isLoading ? (
            <div className="w-[600px] h-[560px] rounded-xl bg-[#202221] dark:bg-card border border-[#D9D9D9]/10 dark:border-border flex flex-col items-center justify-center text-[#D9D9D9] dark:text-foreground">
              <Loader2 className="w-8 h-8 animate-spin opacity-50 mb-4" />
              <p className="font-mono text-xs opacity-50 tracking-widest uppercase">Syncing to chain...</p>
            </div>
          ) : (
            <CardSwap
              width={600}
              height={560}
              cardDistance={50}
              verticalDistance={50}
              delay={2000}
              pauseOnHover={true}
              skewAmount={4}
            >
              {events.filter(e => e.status !== "closed").length > 0 ? (
                events.filter(e => e.status !== "closed").map((event) => {
                  return (
                    <Card
                      key={event.id}
                      className="flex flex-col justify-between p-0 overflow-hidden shadow-2xl bg-[#202221] dark:bg-card"
                    >
                      <div className="w-full h-48 bg-black/20 flex items-center justify-center border-b border-[#D9D9D9]/10 dark:border-border overflow-hidden">
                        <img
                          src={event.image_url || "/placeholder-event.png"}
                          alt={event.title}
                          className="w-full h-full object-cover object-[center_30%]"
                        />
                      </div>

                      <div className="p-8 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest ${event.status === "open" ? "border-green-400/20 bg-green-400/10 text-green-400" :
                                "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                              }`}>
                              <span className={`w-2 h-2 rounded-full animate-ping ${event.status === "open" ? "bg-green-400" : "bg-yellow-400"}`} />
                              {event.status === "open" ? "Registration Open" : "Coming Soon"}
                            </div>
                            <span className="font-mono text-xs text-[#D9D9D9]/60 dark:text-foreground/40">
                              {event.date}
                            </span>
                          </div>

                          <h2 className="text-3xl font-black leading-tight mb-2 text-[#D9D9D9] dark:text-foreground">
                            {event.title}
                          </h2>
                          <p className="text-sm line-clamp-2 text-[#D9D9D9]/80 dark:text-foreground/60">
                            {event.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                          {event.status === "open" ? (
                            <button
                              onClick={() => handleRegister(event.title)}
                              className="px-6 py-3 w-full font-bold rounded-lg transition-all flex items-center justify-center gap-2 group bg-[#CDEF33] text-[#202221] hover:bg-[#CDEF33]/80"
                            >
                              Register for the event <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-6 py-3 w-full font-bold rounded-lg transition-all flex items-center justify-center gap-2 group bg-[#D9D9D9]/5 dark:bg-foreground/5 text-[#D9D9D9]/50 dark:text-foreground/50 cursor-not-allowed"
                            >
                              Registration not open yet
                            </button>
                          )}
                          <Link
                            href="/events"
                            className="px-6 py-3 w-full border font-bold rounded-lg transition-all flex items-center justify-center border-[#D9D9D9]/20 dark:border-border text-[#D9D9D9] dark:text-foreground hover:bg-[#D9D9D9]/5 dark:hover:bg-foreground/5"
                          >
                            Explore all events
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="flex flex-col items-center justify-center p-8 shadow-2xl h-full text-center bg-[#202221] dark:bg-card">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest border-[#D9D9D9]/20 dark:border-foreground/20 bg-[#D9D9D9]/10 dark:bg-foreground/10 text-[#D9D9D9]/50 dark:text-foreground/50 mb-6">
                    Check Back Later
                  </div>
                  <h2 className="text-3xl font-black leading-tight mb-4 text-[#D9D9D9] dark:text-foreground">
                    No Upcoming Events
                  </h2>
                  <p className="text-sm text-[#D9D9D9]/80 dark:text-foreground/60 mb-8 max-w-sm">
                    We are currently brewing up some exciting new hackathons and workshops. Stay tuned!
                  </p>
                  <Link
                    href="/events"
                    className="px-6 py-3 w-full border font-bold rounded-lg transition-all flex items-center justify-center border-[#D9D9D9]/20 dark:border-border text-[#D9D9D9] dark:text-foreground hover:bg-[#D9D9D9]/5 dark:hover:bg-foreground/5"
                  >
                    View Past Events
                  </Link>
                </Card>
              )}
            </CardSwap>
          )}
        </div>
      </div>

      {showTerminal && (
        <RegistrationTerminal eventName={selectedEvent} onClose={() => setShowTerminal(false)} />
      )}
    </section>
  );
}
