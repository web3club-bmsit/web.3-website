"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENTS } from "@/data/events";
import RegistrationTerminal from "./RegistrationTerminal";
import { ArrowRight } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";

export default function UpcomingEventHome() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const handleRegister = (eventName: string) => {
    setSelectedEvent(eventName);
    setShowTerminal(true);
  };

  return (
    <section className="relative w-full py-40 px-8 lg:px-16 flex items-center justify-center min-h-[900px] z-20 bg-[#08080c] mt-24 overflow-hidden">
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side text */}
        <div className="flex flex-col items-start text-left z-30 mb-20 lg:mb-0">
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-6">Flagship<br />Events</h2>
          <p className="text-xl text-white/50 max-w-md">
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
          {EVENTS.map((event, idx) => {
            const isUpcoming = new Date(event.startDate).getTime() > Date.now();
            return (
              <Card key={event.id} className="flex flex-col justify-between p-0 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                <img src="/placeholder-event.png" alt="Futuristic placeholder" className="w-full h-36 object-cover border-b border-white/10" />
                
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-400/20 bg-green-400/5 text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                        {isUpcoming ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                            Upcoming Event
                          </>
                        ) : (
                          "Past Event"
                        )}
                      </div>
                      <span className="text-white/40 font-mono text-xs">{event.date}</span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white leading-tight mb-2">{event.title}</h2>
                    <p className="text-sm text-white/50 line-clamp-2">{event.description}</p>
                  </div>
                
                {isUpcoming && (
                  <div className="flex flex-col gap-3 mt-6">
                    <button 
                      onClick={() => handleRegister(event.title)}
                      className="px-6 py-3 w-full bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-all flex items-center justify-center gap-2 group"
                    >
                      Register for the event <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link 
                      href="/events"
                      className="px-6 py-3 w-full border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                      Explore all events
                    </Link>
                  </div>
                )}
                {!isUpcoming && (
                  <div className="flex flex-col gap-3 mt-6">
                    <Link 
                      href="/events"
                      className="px-6 py-3 w-full bg-white/5 text-white/50 font-bold rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
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
      
      {showTerminal && <RegistrationTerminal eventName={selectedEvent} onClose={() => setShowTerminal(false)} />}
    </section>
  );
}
