"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "2024",
    title: "The Genesis",
    description: "Founded by a small group of crypto pioneers with a vision for a decentralized future.",
  },
  {
    year: "2025",
    title: "Expansion",
    description: "Reached 5,000 active members and launched our first incubation program.",
  },
  {
    year: "2026",
    title: "DAO Transition",
    description: "Fully decentralized governance, giving every member a voice in our evolution.",
  },
  {
    year: "Future",
    title: "Global Network",
    description: "Building physical hubs in every major tech city to bridge the digital and physical worlds.",
  },
];

export default function JourneySection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Our <span className="text-accent underline decoration-4 underline-offset-8">Journey</span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-foreground/10 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1 w-full md:w-auto mb-8 md:mb-0">
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 ${index % 2 === 0 ? "md:mr-12" : "md:ml-12"}`}
                  >
                    <span className="text-4xl font-black text-accent mb-2 block">{milestone.year}</span>
                    <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
                    <p className="text-foreground/60 leading-relaxed">{milestone.description}</p>
                  </motion.div>
                </div>

                <div className="relative z-10 w-12 h-12 rounded-full bg-accent border-4 border-background flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black animate-ping" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
