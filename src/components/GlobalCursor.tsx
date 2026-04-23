"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -999, y: -999 });
  const raf = useRef<number>(0);
  const [mode, setMode] = useState<"default" | "pointer">("default");

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
        cursorRef.current.style.left = pos.current.x + "px";
        cursorRef.current.style.top = pos.current.y + "px";
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
