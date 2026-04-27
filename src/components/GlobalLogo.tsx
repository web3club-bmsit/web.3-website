"use client";

import Image from "next/image";
import Link from "next/link";

export default function GlobalLogo() {
  return (
    <Link href="/" className="absolute top-0 md:top-2 left-4 md:left-8 z-50">
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
    </Link>
  );
}
