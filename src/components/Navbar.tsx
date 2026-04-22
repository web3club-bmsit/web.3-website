"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-background pointer-events-none"
    >
      <Link href="/" className="pointer-events-auto">
        <h1 className="text-2xl font-black uppercase tracking-tighter hover:text-accent transition-colors">
          NULL<span className="text-accent">MASK</span>
        </h1>
      </Link>

      <ul className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest pointer-events-auto">
        <li>
          <Link href="#about" className="hover:text-accent transition-colors">About</Link>
        </li>
        <li>
          <Link href="#events" className="hover:text-accent transition-colors">Events</Link>
        </li>
        <li>
          <Link href="#team" className="hover:text-accent transition-colors">Team</Link>
        </li>
      </ul>

      <button className="pointer-events-auto hidden md:block px-6 py-2 border-2 border-background rounded-full font-bold text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-all">
        Connect
      </button>
    </motion.nav>
  );
}
