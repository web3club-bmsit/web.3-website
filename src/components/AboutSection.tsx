"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Users, Globe, Lock } from "lucide-react";
import SpotlightCard from "@/app/components/ui/SpotlightCard";
import DecryptedText from "@/app/components/ui/DecryptedText";

const benefits = [
  {
    icon: <Shield className="w-10 h-10 text-[#202221] dark:text-[#CDEF33]" />,
    title: "Exclusive Access",
    description: "Get early access to verified Web3 projects and private networking events with industry leaders.",
  },
  {
    icon: <Zap className="w-10 h-10 text-[#202221] dark:text-[#CDEF33]" />,
    title: "Project Incubation",
    description: "Receive mentorship, funding, and technical support to launch your own decentralized applications.",
  },
  {
    icon: <Users className="w-10 h-10 text-[#202221] dark:text-[#CDEF33]" />,
    title: "DAO Governance",
    description: "Participate in meaningful decisions that shape the club's future through decentralized voting.",
  },
];

const infoBlocks = [
  {
    icon: <Globe className="w-10 h-10 text-[#202221] dark:text-[#CDEF33]" />,
    title: "What is Web3?",
    content: (
      <>
        Web3 is the next evolution of the internet—a <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">decentralized, user-centric</span> web built on <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">blockchain technology</span>. Unlike the current internet where large corporations own your data, Web3 empowers individuals with <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">true digital ownership</span>, privacy, and permissionless systems.
      </>
    ),
  },
  {
    icon: <Lock className="w-10 h-10 text-[#202221] dark:text-[#CDEF33]" />,
    title: "The Future Impact",
    content: (
      <>
        By removing centralized intermediaries, Web3 is paving the way for <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">trustless digital economies</span>, transparent governance, and <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">censorship-resistant platforms</span>. It shifts power back to creators and builders, laying the foundation for a more <span className="text-[#202221] dark:text-[#CDEF33] font-semibold">equitable digital future</span>.
      </>
    ),
  }
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#202221]/5 dark:bg-[#CDEF33]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#202221]/5 dark:bg-[#CDEF33]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Info Blocks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {infoBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <SpotlightCard 
                className="h-full p-8 md:p-12 rounded-[2rem] bg-foreground/[0.02] border border-foreground/10 hover:border-[#202221]/40 dark:hover:border-[#CDEF33]/40 transition-colors" 
                spotlightColor="rgba(205, 239, 51, 0.15)"
              >
                <div className="mb-6 p-4 bg-[#202221]/10 dark:bg-[#CDEF33]/10 w-fit rounded-2xl border border-[#202221]/20 dark:border-[#CDEF33]/20">
                  {block.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter mb-4">
                  <DecryptedText text={block.title} speed={40} encryptedClassName="text-[#202221] dark:text-[#CDEF33]" />
                </h2>
                <div className="h-1.5 w-16 bg-[#202221] dark:bg-[#CDEF33] mb-6 rounded-full shadow-[0_0_15px_rgba(32,34,33,0.3)] dark:shadow-[0_0_15px_rgba(205,239,51,0.5)]" />
                <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                  {block.content}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Member Benefits Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">
            <DecryptedText text="Member Benefits" speed={50} maxIterations={12} />
          </h2>
          <div className="h-2 w-24 bg-accent mt-4 rounded-full" />
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
              className="h-full"
            >
              <SpotlightCard 
                className="h-full p-8 bg-foreground/[0.02] rounded-[2rem] border border-foreground/10 hover:border-[#202221]/50 dark:hover:border-[#CDEF33]/50 transition-all duration-300" 
                spotlightColor="rgba(205, 239, 51, 0.15)"
              >
                <div className="mb-6 p-4 bg-[#202221]/10 dark:bg-[#CDEF33]/10 w-fit rounded-2xl border border-[#202221]/20 dark:border-[#CDEF33]/20 shadow-[0_0_20px_rgba(32,34,33,0.1)] dark:shadow-[0_0_20px_rgba(205,239,51,0.1)]">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {benefit.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
