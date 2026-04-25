import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const architypeFont = localFont({
  src: "../../public/fonts/CraftFont.ttf",
  variable: "--font-logo",
  display: "swap",
});

import { ThemeProvider } from "@/components/ThemeProvider";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import Navbar from "@/app/components/navbar";
import GlobalLogo from "@/components/GlobalLogo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${architypeFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalLogo />
          <PreloaderWrapper>
            <Navbar />
            {children}
            <Footer />
          </PreloaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
