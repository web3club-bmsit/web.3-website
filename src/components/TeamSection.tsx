"use client";

import { motion } from "framer-motion";
import { MessageCircle, Code2, Share2, ExternalLink } from "lucide-react";

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & Lead Architect",
    skills: ["Solidity", "Zero Knowledge", "Rust"],
  },
  {
    name: "Sarah Chen",
    role: "Head of Community",
    skills: ["DAO Governance", "Marketing", "Strategy"],
  },
  {
    name: "Marcus Thorne",
    role: "Product Designer",
    skills: ["UI/UX", "Generative Art", "Motion"],
  },
  {
    name: "Elena Volkova",
    role: "Technical Advisor",
    skills: ["Cryptography", "Ethereum", "EVM"],
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-background border-y border-foreground/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              The <span className="text-accent">Brains</span>
            </h2>
            <div className="h-2 w-24 bg-accent mt-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 hover:border-accent transition-all duration-300"
            >
              {/* Profile Image Placeholder */}
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 rounded-full bg-accent overflow-hidden flex items-center justify-center text-black font-black text-2xl">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
              <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">{member.role}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {member.skills.map((skill, si) => (
                  <span key={si} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-foreground/10 text-foreground/60">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <MessageCircle className="w-5 h-5 text-foreground/40 hover:text-accent cursor-pointer transition-colors" />
                <Code2 className="w-5 h-5 text-foreground/40 hover:text-accent cursor-pointer transition-colors" />
                <Share2 className="w-5 h-5 text-foreground/40 hover:text-accent cursor-pointer transition-colors" />
              </div>

              <button className="absolute top-6 right-6 p-2 rounded-full border border-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
