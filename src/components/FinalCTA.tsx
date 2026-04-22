"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(205,239,51,0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent font-bold text-sm uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" /> Limited Availability
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-none mb-10">
            Ready to Build <br /> <span className="text-accent underline decoration-8 underline-offset-8">Legacy?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-foreground/60 mb-12 max-w-2xl mx-auto">
            Applications for the next cohort of members are now open. Secure your place in the future of web3.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-foreground text-background font-black rounded-full text-xl shadow-2xl flex items-center gap-3 justify-center group"
            >
              Apply to Join <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 border-2 border-foreground/20 text-foreground font-black rounded-full text-xl hover:border-foreground transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer-like credit */}
      <div className="mt-32 border-t border-foreground/5 py-8 text-center text-foreground/30 text-sm font-bold uppercase tracking-widest">
        &copy; 2026 WEB3 CLUB COLLECTIVE. ALL RIGHTS RESERVED.
      </div>
    </section>
  );
}
