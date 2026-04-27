"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalLogo() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const logoContent = (
    <>
      <Image
        src="/logos/club-light.svg"
        alt="WEB.3 BMSIT"
        width={220}
        height={150}
        className="object-contain hover:scale-105 transition-transform duration-300 dark:hidden"
        priority
      />
      <Image
        src="/logos/club-dark.svg"
        alt="WEB.3 BMSIT"
        width={220}
        height={150}
        className="object-contain hover:scale-105 transition-transform duration-300 hidden dark:block"
        priority
      />
    </>
  );

  if (isHome) {
    return (
      <div className="absolute top-0 left-0 w-full h-[500vh] pointer-events-none z-50">
        <div className="sticky top-0 left-0 w-full">
          <div className="absolute top-[1.5rem] left-4 md:left-12 h-[50px] flex items-center pointer-events-auto">
            <Link href="/" className="block" style={{ transform: "translate(-30px, 14px)" }}>
              {logoContent}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-[1.5rem] left-4 md:left-12 h-[50px] flex items-center z-50 pointer-events-auto">
      <Link href="/" className="block" style={{ transform: "translate(-30px, 14px)" }}>
        {logoContent}
      </Link>
    </div>
  );
}





