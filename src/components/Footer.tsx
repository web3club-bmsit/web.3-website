"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { socialLinks } from "@/data/footerData";

const CUBES = [
  { size: 80, left: 15, top: 30, z: -200, rx: 35, ry: 45, delay: 0, duration: 18 },
  { size: 45, left: 85, top: 20, z: -400, rx: -25, ry: 15, delay: 2, duration: 22 },
  { size: 110, left: 25, top: 60, z: 150, rx: 15, ry: -35, delay: 1, duration: 25 },
  { size: 35, left: 75, top: 70, z: -100, rx: 55, ry: 45, delay: 3, duration: 20 },
  { size: 65, left: 65, top: 40, z: 50, rx: -15, ry: 25, delay: 0.5, duration: 15 },
  { size: 55, left: 10, top: 75, z: -300, rx: 10, ry: -10, delay: 4, duration: 24 },
  { size: 90, left: 45, top: 25, z: -50, rx: 70, ry: 20, delay: 1.5, duration: 19 },
  { size: 40, left: 55, top: 85, z: -150, rx: -35, ry: -45, delay: 2.5, duration: 17 },
  { size: 75, left: 80, top: 55, z: 200, rx: 45, ry: -25, delay: 1.2, duration: 21 },
  { size: 50, left: 35, top: 15, z: -250, rx: -45, ry: 35, delay: 3.5, duration: 16 },
  { size: 100, left: 90, top: 80, z: 300, rx: 25, ry: 15, delay: 0.8, duration: 23 },
  { size: 60, left: 20, top: 45, z: -100, rx: 15, ry: 65, delay: 2.2, duration: 18 },
  { size: 30, left: 40, top: 65, z: -350, rx: -15, ry: -25, delay: 4.5, duration: 14 },
  { size: 85, left: 5, top: 50, z: 100, rx: 35, ry: 5, delay: 1.8, duration: 20 },
  { size: 45, left: 60, top: 15, z: -180, rx: -25, ry: 55, delay: 2.8, duration: 22 },
  { size: 70, left: 70, top: 90, z: 50, rx: 5, ry: -45, delay: 0.3, duration: 19 },
];

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Only track if footer is visible or near visible to save performance
      if (rect.top < window.innerHeight + 100) {
        // Normalize mouse pos from -1 to 1 based on screen
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setMousePos({ x, y });
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";

  // Strict Design System Colors
  const themeStyle = {
    "--footer-bg": "var(--background)",
    "--footer-text": "var(--foreground)",
    "--footer-accent": "var(--accent)",
    "--footer-secondary": isDark ? "#202221" : "#666666", // Kept a bit visible in light mode
    "--bg-opacity": isDark ? "0.25" : "0.6", // Much higher opacity for light mode text
    
    // Cube face shading for 3D depth
    "--cube-border": isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.15)",
    "--cube-front": isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)",
    "--cube-back": isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)",
    "--cube-right": isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.25)",
    "--cube-left": isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
    "--cube-top": isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,1)",
    "--cube-bottom": isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        .footer-container {
          background-color: var(--footer-bg);
          color: var(--footer-text);
          transition: background-color 0.5s ease, color 0.5s ease;
        }
        
        .bg-web3-text {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: clamp(8rem, 30vw, 35rem);
          font-weight: 900;
          line-height: 1;
          opacity: var(--bg-opacity);
          background: linear-gradient(to bottom, var(--footer-text) 0%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          z-index: 1;
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: 'Inter', sans-serif;
        }
        
        .cube-scene {
          position: absolute;
          inset: 0;
          perspective: 1000px;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }
        
        .cube-parallax-layer {
          position: absolute;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .cube-wrapper {
          position: absolute;
          transform-style: preserve-3d;
          animation: floatCube var(--duration) ease-in-out infinite alternate;
          animation-delay: var(--delay);
        }
        
        @keyframes floatCube {
          0% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          100% { transform: translateY(-120px) rotateX(15deg) rotateY(25deg); }
        }
        
        .cube {
          position: relative;
          width: var(--size);
          height: var(--size);
          transform-style: preserve-3d;
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid var(--cube-border);
          backdrop-filter: blur(2px);
        }
        
        .face-front  { transform: translateZ(calc(var(--size) / 2)); background: var(--cube-front); }
        .face-back   { transform: rotateY(180deg) translateZ(calc(var(--size) / 2)); background: var(--cube-back); }
        .face-right  { transform: rotateY(90deg) translateZ(calc(var(--size) / 2)); background: var(--cube-right); }
        .face-left   { transform: rotateY(-90deg) translateZ(calc(var(--size) / 2)); background: var(--cube-left); }
        .face-top    { transform: rotateX(90deg) translateZ(calc(var(--size) / 2)); background: var(--cube-top); }
        .face-bottom { transform: rotateX(-90deg) translateZ(calc(var(--size) / 2)); background: var(--cube-bottom); }
        
        .link-hover {
          position: relative;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .link-hover::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background-color: var(--footer-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .link-hover:hover {
          color: var(--footer-accent);
          text-shadow: 0 0 12px rgba(205, 239, 51, 0.4);
        }
        .link-hover:hover::after {
          transform: scaleX(1);
        }
      `}</style>

      <footer 
        ref={containerRef} 
        className="footer-container relative w-full h-[75vh] flex flex-col justify-end font-sans" 
        style={themeStyle}
      >
        
        {/* Top Gradient Fade to blend with page above */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none mix-blend-normal opacity-100" />

        {/* Background Layer: Large WEB3 Typography */}
        <div 
          className="bg-web3-text" 
          style={{ 
            transform: `translate(calc(-50% + ${mousePos.x * -30}px), calc(-50% + ${mousePos.y * -30}px))` 
          }}
        >
          WEB3
        </div>

        {/* Mid Layer: Floating Geometric Cubes */}
        <div className="cube-scene">
          {CUBES.map((c, i) => {
            // Calculate parallax depth
            const pX = (mousePos.x * (c.z + 800)) / 40;
            const pY = (mousePos.y * (c.z + 800)) / 40;
            
            return (
              <div 
                key={i} 
                className={`cube-parallax-layer ${i > 7 ? 'hidden md:block' : ''}`}
                style={{
                  left: `${c.left}%`,
                  top: `${c.top}%`,
                  transform: `translate3d(${pX}px, ${pY}px, ${c.z}px)`,
                  zIndex: c.z > 0 ? 10 : 1
                }}
              >
                <div 
                  className="cube-wrapper"
                  style={{ 
                    '--duration': `${c.duration}s`, 
                    '--delay': `${c.delay}s` 
                  } as React.CSSProperties}
                >
                  <div 
                    className="cube"
                    style={{ 
                      '--size': `${c.size}px`,
                      transform: `rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
                    } as React.CSSProperties}
                  >
                    <div className="cube-face face-front"></div>
                    <div className="cube-face face-back"></div>
                    <div className="cube-face face-right"></div>
                    <div className="cube-face face-left"></div>
                    <div className="cube-face face-top"></div>
                    <div className="cube-face face-bottom"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Foreground Layer: Minimal UI */}
        <div className="relative z-20 flex flex-col md:flex-row justify-between items-center md:items-end p-8 md:p-12 lg:px-24 w-full mx-auto gap-8 mb-4">
          
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight m-0">WEB3</h3>
            <p className="text-sm font-light" style={{ color: "var(--footer-secondary)" }}>
              © 2026 Web3 Club
            </p>
          </div>

          {/* Right Column */}
          <div className="flex gap-8 items-center">
            {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} target="_blank" className="link-hover text-base md:text-lg font-medium tracking-wide capitalize">
                {link.label.toLowerCase()}
              </Link>
            ))}
          </div>

        </div>
      </footer>
    </>
  );
}
