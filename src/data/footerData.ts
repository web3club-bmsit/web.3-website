// ─────────────────────────────────────────────────────────────
// Footer data — roiheads-style minimal footer
// ─────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  href: string;
}

export const socialLinks: FooterLink[] = [
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/web.3.bmsit",
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/company/web3-club-%E2%80%93-bmsit-m/", /* LinkedIn URL — add later */
  },
];

export const legalLinks: FooterLink[] = [
  { label: "PRIVACY POLICY", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
];

export const copyrightText = "© 2025 WEB3 BMSIT";

export const displayLines = [
  { text: "WE BUILD", accent: false },
  { text: "ON-CHAIN", accent: true },
] as const;
