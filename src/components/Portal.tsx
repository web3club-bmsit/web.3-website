"use client";

/**
 * Portal — TRUE 3D hollow ring using translateZ depth positioning.
 *
 * Renders as a React fragment (no wrapper div) so both layers
 * participate directly in the parent's preserve-3d context.
 *
 *   translateZ(-150px) — BACK WALL: darker green filled oval (far side)
 *   translateZ(0)      — TRAY lives here (see Platform.tsx)
 *   translateZ(130px)  — FRONT RIM: thick green ring, transparent center (near side)
 *
 * The browser's 3D renderer handles occlusion automatically:
 *   - Tray visible through the front rim's transparent center (inside portal)
 *   - Tray hidden behind the front rim's thick border (crossing the rim)
 *   - Tray visible where it extends past the portal oval (outside portal)
 *
 * NO clip-path needed — true 3D depth sorting does the work.
 */
export default function Portal() {
  return (
    <>
      {/* ── BACK WALL — physically behind the tray ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateZ(-150px)",
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, #b8d42e 0%, #a0bc24 40%, #8aaa1e 100%)",
          border: "3px solid #000",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }}
      />

      {/* ── FRONT RIM — physically in front of the tray ── */}
      {/* Thick border = the ring edge. Transparent center = the opening. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateZ(130px)",
          borderRadius: "50%",
          background: "transparent",
          border: "28px solid #CDEF33",
          boxShadow:
            "0 0 0 3px #000, inset 0 0 0 2px rgba(0,0,0,0.12), 0 0 40px rgba(205,239,51,0.2)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
