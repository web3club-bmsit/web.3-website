"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Global Web3 Summit",
    date: "May 15-18, 2026",
    location: "Metaverse / Lisbon",
    type: "Summit",
  },
  {
    title: "DeFi Governance Workshop",
    date: "June 02, 2026",
    location: "Exclusive Zoom",
    type: "Workshop",
  },
  {
    title: "NFT Artist Mixer",
    date: "June 12, 2026",
    location: "New York City",
    type: "Social",
  },
];

export default function EventsSection() {
  return (
    <section className="py-24 bg-[#202221] text-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Upcoming <span className="text-accent">Events</span>
            </h2>
            <div className="h-2 w-24 bg-accent mt-4" />
          </div>
          <button className="flex items-center gap-2 group text-lg font-bold">
            View All Events <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-1 group cursor-pointer"
            >
              <div className="relative h-full p-8 rounded-[2rem] bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-accent/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                
                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                  {event.type}
                </span>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex flex-col gap-1 text-white/50 text-sm mt-4">
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="font-bold">Register Now</span>
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
