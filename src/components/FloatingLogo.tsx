"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FloatingLogoProps {
  src: string;
  delay?: number;
  depth?: number;
  left: string;
  top: string;
}

/**
 * FloatingLogo — stands upright on the tilted tray surface.
 *
 * Counter-rotates against the tray's rotateX(55deg) so logos face the viewer.
 * Uses gentle Z-axis tilt + bobbing (NOT Y-axis spin, which causes invisibility).
 * backfaceVisibility ensures logos are always rendered.
 */
export default function FloatingLogo({
  src,
  delay = 0,
  depth = 1,
  left,
  top,
}: FloatingLogoProps) {
  const totalDelay = 1.2 + delay * 0.4;

  return (
    <motion.div
      style={{
        position: "absolute",
        left,
        top,
        transformStyle: "preserve-3d",
        transformOrigin: "center bottom",
      }}
      initial={{
        rotateX: -55,
        rotateZ: 5,
        scale: 0,
        opacity: 0,
        y: 20,
      }}
      animate={{
        rotateX: -55,
        rotateZ: 5,
        scale: 1,
        opacity: 1,
        y: -15,
      }}
      transition={{
        duration: 0.8,
        delay: totalDelay,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      {/* Gentle floating animation — bob + tilt, NO Y-spin */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-4, 4, -4],
        }}
        transition={{
          y: {
            duration: 3 + depth,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4 + depth,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <Image
          src={src}
          alt=""
          width={80}
          height={80}
          style={{
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
            backfaceVisibility: "visible",
          }}
          priority
        />
      </motion.div>
    </motion.div>
  );
}
