"use client";

import { motion } from "framer-motion";

export default function HeroSection() {

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-background pt-20">
      {/* ── CONTENT ── */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 pointer-events-none">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-foreground/20 bg-background/50 backdrop-blur-md font-bold text-xs uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              The Sovereign Network
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-8">
              Decentralize <br />
              Everything.
            </h1>

            <p className="text-xl md:text-2xl text-foreground mb-12 font-medium max-w-xl">
              An exclusive collective of builders and visionaries shaping the
              bleeding edge of Web3.
            </p>


          </motion.div>
        </div>
      </div>
    </section>
  );
}
