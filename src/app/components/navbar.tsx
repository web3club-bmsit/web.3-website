"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, ShieldAlert, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// NAV TABS (Contact added here)
// ─────────────────────────────────────────────────────────────
const NAV_TABS = [
  { label: "Home",    href: "/"        },
  { label: "About",   href: "/about"   },
  { label: "Team",    href: "/team"    },
  { label: "Events",  href: "/events"  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    // ... (supabase auth logic remains same)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .single();
          setIsAdmin(profile?.role === "admin");
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isHero = pathname === "/" && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-4 left-0 right-0 z-[9999] transition-all duration-500 transform ${
          scrolled ? "translate-y-0" : "translate-y-2"
        }`}
      >
        <div 
          className={`mx-auto transition-all duration-500 ease-out flex items-center justify-between px-6 py-2 rounded-full border shadow-2xl backdrop-blur-xl ${
            scrolled 
              ? "max-w-4xl bg-nav-surface border-nav-border" 
              : "max-w-5xl bg-black/10 border-white/10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Image
                src="/logos/clubLogo-white.png"
                alt="WEB.3 BMSIT"
                width={28}
                height={28}
                className={`w-7 h-7 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] ${!scrolled && !isHero && theme === 'light' ? 'invert' : isHero ? '' : (theme === 'light' ? 'invert' : '')}`}
              />
            </div>
            <span className={`font-mono font-bold text-xs tracking-widest transition-colors uppercase ${isHero ? 'text-accent' : scrolled ? 'text-accent' : 'text-accent'}`}>
              WEB.3
            </span>
          </Link>

          {/* Desktop tabs */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_TABS.map((tab) => (
              <li key={tab.label}>
                <Link
                  href={tab.href}
                  onClick={() => setWithActive(tab.label)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    active === tab.label
                      ? "text-accent bg-accent/10"
                      : isHero 
                        ? "text-white/60 hover:text-white hover:bg-white/5" 
                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            ))}

            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isHero 
                      ? "text-yellow-400/60 hover:text-yellow-400 hover:bg-white/5" 
                      : "text-yellow-500/70 hover:text-yellow-500 hover:bg-yellow-500/5"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isHero ? "text-white/70 hover:text-white hover:bg-white/10" : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth State (Desktop) */}
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-3 ml-1">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-mono uppercase tracking-tighter ${isHero ? 'text-white/40' : 'text-foreground/40'}`}>Auth</span>
                    <span className={`text-[10px] font-semibold max-w-[100px] truncate ${isHero ? 'text-white/70' : 'text-foreground/70'}`}>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`p-2 rounded-full transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${isHero ? 'text-white/40 hover:text-red-400 hover:bg-white/10' : 'text-foreground/40 hover:text-red-400 hover:bg-foreground/10'}`}
                    title="Logout"
                  >
                    {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> : <LogOut className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    isHero 
                      ? "bg-white/10 border-white/20 text-white/90 hover:bg-white/20" 
                      : "bg-foreground/5 border-foreground/10 text-foreground/80 hover:bg-foreground/10"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-accent rounded transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block w-5 h-0.5 bg-accent rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-accent rounded transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-accent/10 flex flex-col px-6 py-6 gap-3">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => { setWithActive(tab.label); setMenuOpen(false); }}
              className={`py-2 text-sm font-semibold border-b border-foreground/5 transition-colors ${
                active === tab.label ? "text-accent" : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-semibold text-yellow-400 border-b border-foreground/5 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}

          <div className="mt-4 pt-4 border-t border-foreground/5">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground/30 uppercase font-mono">Profile</span>
                    <span className="text-xs text-foreground/70 truncate max-w-[200px]">{user.email}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 text-red-400 rounded-md text-xs font-bold border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-black rounded-md text-xs font-bold"
              >
                <LogIn className="w-4 h-4" />
                Login with Google
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}