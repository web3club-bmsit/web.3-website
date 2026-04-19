"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Users } from "lucide-react";

const benefits = [
  {
    icon: <Shield className="w-10 h-10 text-accent" />,
    title: "Exclusive Access",
    description: "Get early access to verified Web3 projects and private networking events with industry leaders.",
  },
  {
    icon: <Zap className="w-10 h-10 text-accent" />,
    title: "Project Incubation",
    description: "Receive mentorship, funding, and technical support to launch your own decentralized applications.",
  },
  {
    icon: <Users className="w-10 h-10 text-accent" />,
    title: "DAO Governance",
    description: "Participate in meaningful decisions that shape the club's future through decentralized voting.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">
            Member Benefits
          </h2>
          <div className="h-2 w-24 bg-accent mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="p-8 bg-foreground/5 rounded-[2rem] border border-foreground/10 hover:border-accent/40 transition-all duration-300"
            >
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-foreground/60 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
