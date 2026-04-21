"use client";

import Navbar from "../components/navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 sm:px-10 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            Get in <span className="text-green-400">Touch</span>
          </h1>
          <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
            Have a project idea or want to join the collective? Reach out and let's build the future of Web3 together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-green-400/30 transition-all flex items-start gap-6">
              <Mail className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold mb-1">Email Us</h3>
                <p className="text-foreground/50">hello@web3bmsit.org</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-green-400/30 transition-all flex items-start gap-6">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold mb-1">Discord</h3>
                <p className="text-foreground/50">Join our community server</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-10 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/30 ml-2">Your Name</label>
              <input 
                type="text" 
                placeholder="Vitalik Buterin" 
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400/50 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/30 ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="vitalik@ethereum.org" 
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/30 ml-2">Message</label>
              <textarea 
                rows={4}
                placeholder="What's on your mind?" 
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400/50 transition-all resize-none"
              />
            </div>

            <button className="bg-green-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
