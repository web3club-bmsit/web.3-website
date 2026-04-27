"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -999, y: -999 });
  const raf = useRef<number>(0);
  const [mode, setMode] = useState<"default" | "pointer">("default");
  const modeRef = useRef<"default" | "pointer">("default");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      setMode(isClickable ? "pointer" : "default");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleMouseOver);

    const animate = () => {
      if (cursorRef.current) {
        const centerOffset = modeRef.current === "pointer" ? "translate(-30%, -10%)" : "translate(-50%, -50%)";
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) ${centerOffset}`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor mode-${mode}`}
      style={{ pointerEvents: "none", zIndex: 999999 }}
    />
  );
}
