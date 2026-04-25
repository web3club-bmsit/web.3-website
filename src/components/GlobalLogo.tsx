"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLogo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  // Use the dark logo until mounted so it doesn't flash the wrong one during SSR (or default to something safe)
  const isDark = !mounted || resolvedTheme !== "light";

  if (pathname !== "/" && pathname !== "/contact") {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 z-20 pointer-events-none">
      <Image
        src={isDark ? "/logos/club-dark.svg" : "/logos/club-light.svg"}
        alt="WEB.3 BMSIT"
        width={220}
        height={150}
        className="object-contain"
        priority
      />
    </div>
  );
}
