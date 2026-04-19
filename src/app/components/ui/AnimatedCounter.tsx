"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

// Replaces GSAP SplitText — each character rises in with stagger on scroll entry
export default function AnimatedCounter({ text, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
