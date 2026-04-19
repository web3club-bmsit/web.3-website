"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PlatformProps {
  children?: ReactNode;
}

/**
 * Platform — the isometric tray at translateZ(0), physically between
 * the back wall (-150px) and front rim (+130px).
 *
 * All containers maintain preserve-3d so the tray's rotateX(55deg)
 * participates in the parent scene's 3D space. The front rim naturally
 * occludes the tray where its thick border overlaps — TRUE 3D.
 *
 * Animation: slides LEFT from centered (inside portal) to extended
 * (partially outside the portal ring on the left).
 */
export default function Platform({ children }: PlatformProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: "translateZ(0px)",
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: "360px",
          height: "260px",
          transformStyle: "preserve-3d",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 0.4, opacity: 0 }}
        animate={{ x: "-85%", y: "-50%", scale: 1, opacity: 1 }}
        transition={{
          duration: 2,
          delay: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Isometric 3D tilt — in the scene's 3D space */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transform: "rotateX(55deg) rotateZ(-3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Tray surface */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #d8f248 0%, #CDEF33 50%, #b8d42e 100%)",
              border: "3px solid #000",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          />

          {/* Tray bottom edge (thickness) */}
          <div
            style={{
              position: "absolute",
              left: "4px",
              right: "4px",
              bottom: "-12px",
              height: "14px",
              borderRadius: "0 0 14px 14px",
              background:
                "linear-gradient(180deg, #b8d42e 0%, #8aaa1e 100%)",
              border: "2px solid #000",
              borderTop: "none",
              transform: "rotateX(-90deg)",
              transformOrigin: "top center",
            }}
          />

          {/* Logos container */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
