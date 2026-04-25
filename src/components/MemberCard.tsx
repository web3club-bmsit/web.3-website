"use client";
import { useState, useRef } from "react";
type MemberCardProps = {
  name: string;
  role: string;
  description?: string;
  image?: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
};
export default function MemberCard({
  name,
  role,
  description,
  image,
  socials,
}: MemberCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setGlow({ x, y });
    setRotate({
      x: ((y / height) - 0.5) * 10,
      y: ((x / width) - 0.5) * -10,
    });
  };
  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    
  <div
        ref={cardRef}
        className="member-card-root"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          borderRadius: "16px",
          padding: "1.5px", 
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: hovered
            ? "conic-gradient(from var(--angle, 0deg), #CDEF33 0%, #202221 25%, #000 50%, #CDEF33 75%, #202221 100%)"
            : "linear-gradient(135deg, #20222130 0%, #CDEF3320 50%, #20222115 100%)",
          animation: hovered ? "spinBorder 2s linear infinite" : "none",
          // transition on background would fight animation — intentionally omitted
        }}
      >

        {/* Outer ambient glow — purely decorative, doesn't affect layout */}
        {hovered && (
          <div style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: "28px",
            background: `radial-gradient(ellipse at ${glow.x}px ${glow.y}px, rgba(205,239,51,0.12), transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }} />
        )}

        {/* Inner card — perspective tilt lives here */}
        <div
          style={{
            transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${hovered ? 6 : 0}px)`,
            transition: "transform 0.15s ease-out",
            borderRadius: "15px",
            background: "#000000",
            border: "1px solid rgba(32,34,33,0.18)",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cursor-tracking radial glow inside card */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "15px",
            background: hovered
              ? `radial-gradient(240px at ${glow.x}px ${glow.y}px, rgba(205,239,51,0.08), transparent)`
              : "transparent",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.1s",
          }} />

          {/* Scanline texture overlay — Web3 aesthetic */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* IMAGE */}
          <div style={{
            width: "100%",
            aspectRatio: "4 / 3",
            position: "relative",
            zIndex: 2,
            overflow: "hidden",
          }}>
            <img
              src={image || "https://i.pravatar.cc/400?img=1"}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 20%",
                display: "block",
                filter: hovered
                  ? "brightness(1.05) grayscale(0)"
                  : "brightness(0.88) grayscale(0.15)",
                transition: "filter 0.4s ease-out",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, transparent, #000000)",
              pointerEvents: "none",
              zIndex: 3,
            }} />
          </div>

          {/* CONTENT */}
          <div style={{
            padding: "16px 18px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            flex: 1,
          }}>
            {/* Role pill */}
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#CDEF33",
              background: "rgba(205,239,51,0.08)",
              border: "1px solid rgba(205,239,51,0.2)",
              borderRadius: "999px",
              padding: "3px 10px",
              marginBottom: "8px",
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {role}
            </span>

            <h3 style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#D9D9D9",
              margin: "0 0 6px",
              letterSpacing: "0.02em",
              fontFamily: "'Syne', sans-serif",
            }}>
              {name}
            </h3>

                        {description && (
              <p style={{
                fontSize: "12px",
                color: hovered ? "rgba(217,217,217,0.92)" : "rgba(217,217,217,0.6)",
                lineHeight: 1.6,
                margin: "0 0 14px",
                maxWidth: "220px",
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "color 0.3s ease",
              }}>
                {description}
              </p>
            )}

            {/* Divider */}
            <div style={{
              width: "40px",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(205,239,51,0.4), transparent)",
              margin: "auto auto 14px",
            }} />
      
    <div style={{ display: "flex", gap: "18px", justifyContent: "center" }}>
              {socials.twitter && (
                <SocialLink href={socials.twitter} hoverColor="#CDEF33">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2H21l-6.56 7.49L22.5 22h-6.828l-5.346-6.993L4.5 22H1.744l7.02-8.017L1.5 2h6.914l4.838 6.418L18.244 2z"/>
                  </svg>
                </SocialLink>
              )}
              {socials.linkedin && (
                <SocialLink href={socials.linkedin} hoverColor="#D9D9D9">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4zM8.5 8h3.6v2.2h.05c.5-.95 1.7-2.2 3.5-2.2 3.7 0 4.4 2.4 4.4 5.6V24h-4v-7.8c0-1.9-.03-4.3-2.6-4.3-2.6 0-3 2-3 4.2V24h-4z"/>
                  </svg>
                </SocialLink>
              )}
              {socials.github && (
                <SocialLink href={socials.github} hoverColor="#D9D9D9">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 5 3.2 9.3 7.6 10.8.6.1.8-.2.8-.6v-2c-3.1.7-3.7-1.3-3.7-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 1.7 2.8 2.4 1.5.3 2.5-.6 3.1-1.2.1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.2-5.2-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11.2 11.2 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3 0 4.3-2.7 5.2-5.2 5.5.4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.4-1.5 7.6-5.8 7.6-10.8C23.2 5.4 18.3.5 12 .5z"/>
                  </svg>
                </SocialLink>
              )}
              {socials.instagram && (
                <SocialLink href={socials.instagram} hoverColor="#CDEF33">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5C19.66 2 22 4.34 22 7.75v8.5C22 19.66 19.66 22 16.25 22h-8.5C4.34 22 2 19.66 2 16.25v-8.5C2 4.34 4.34 2 7.75 2zm4.25 5.5A4.75 4.75 0 1016.75 12 4.75 4.75 0 0012 7.5zm0 7.8A3.05 3.05 0 1115.05 12 3.05 3.05 0 0112 15.3zm4.9-8.4a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z"/>
                  </svg>
                </SocialLink>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
function SocialLink({
  href,
  children,
  hoverColor,
}: {
  href: string;
  children: React.ReactNode;
  hoverColor: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? hoverColor : "rgba(217,217,217,0.35)",
        transform: hov ? "scale(1.3) translateY(-1px)" : "scale(1)",
        transition: "color 0.2s, transform 0.2s",
        display: "flex",
      }}
    >
      {children}
    </a>
  );
}


      