"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Portal from "./Portal";
import Platform from "./Platform";
import FloatingLogo from "./FloatingLogo";

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 70 };
  const translateX = useSpring(
    useTransform(mouseX, [-1, 1], [-15, 15]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(mouseY, [-1, 1], [-10, 10]),
    springConfig
  );

  useEffect(() => {
    // Parallax logic removed to keep portal completely stable on hover
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-background pt-20">
      {/* ── TRUE 3D PORTAL SCENE ──
          Uses CSS 3D transforms (preserve-3d + translateZ) for real depth:
            Back wall:  translateZ(-150px) — far side of hollow portal
            Tray:       translateZ(0)      — inside the hollow
            Front rim:  translateZ(+130px) — near side, occludes tray via 3D
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end lg:pr-[5%] pointer-events-none">
        <div
          style={{
            position: "relative",
            width: "480px",
            height: "580px",
          }}
        >
          {/* 2D Effects — outside 3D context */}
          <div
            style={{
              position: "absolute",
              inset: "-18%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(205,239,51,0.3) 0%, rgba(205,239,51,0.08) 50%, transparent 75%)",
              filter: "blur(25px)",
              animation: "portalPulse 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-6%",
              borderRadius: "50%",
              border: "2px dashed rgba(205,239,51,0.35)",
              animation: "portalSpin 18s linear infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-11%",
              borderRadius: "50%",
              border: "1.5px dashed rgba(205,239,51,0.2)",
              animation: "portalSpinReverse 28s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* 3D Scene — perspective + preserve-3d */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: "1000px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transform: "rotateY(-8deg)",
              }}
            >
              <Portal />

              <Platform>
                <FloatingLogo
                  src="/logos/MetaMask.svg"
                  delay={0.0}
                  depth={1.0}
                  left="5%"
                  top="20%"
                />
                <FloatingLogo
                  src="/logos/bitcoin.svg"
                  delay={0.3}
                  depth={0.9}
                  left="48%"
                  top="18%"
                />
                <FloatingLogo
                  src="/logos/ethereum.svg"
                  delay={0.5}
                  depth={0.7}
                  left="25%"
                  top="8%"
                />
                <FloatingLogo
                  src="/globe.svg"
                  delay={0.7}
                  depth={0.5}
                  left="15%"
                  top="40%"
                />
              </Platform>
            </div>
          </div>
        </div>
      </div>

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

            <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-foreground text-background font-bold rounded-full text-lg shadow-xl shadow-foreground/10 hover:bg-accent hover:text-foreground transition-all flex items-center justify-center gap-2 group"
              >
                Access Portal{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-foreground/20 text-foreground font-bold rounded-full text-lg hover:border-foreground bg-background/50 backdrop-blur-md transition-colors"
              >
                View Protocol
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
