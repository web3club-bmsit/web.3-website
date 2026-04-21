"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, ShieldAlert, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// ─────────────────────────────────────────────────────────────
// ADD YOUR TABS HERE — just push an object to this array.
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
  const [active, setWithActive] = useState("Home");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
    });

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-accent/20 shadow-lg" 
            : "bg-black/20 backdrop-blur-[2px]"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/logos/clubLogo-white.png"
                alt="WEB.3 BMSIT"
                width={32}
                height={32}
                className="w-8 h-8 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
              />
            </div>
            <span className="font-mono text-accent font-bold text-sm tracking-wider group-hover:text-white transition-colors uppercase">
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
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    active === tab.label
                      ? "text-accent bg-accent/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
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
                  className="px-4 py-2 flex items-center gap-2 rounded-md text-sm font-semibold text-yellow-400/70 hover:text-yellow-400 hover:bg-yellow-400/5 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth State (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-mono uppercase tracking-tighter ${scrolled ? 'text-foreground/30' : 'text-white/40'}`}>Authenticated</span>
                    <span className={`text-xs font-semibold max-w-[120px] truncate ${scrolled ? 'text-foreground/60' : 'text-white/70'}`}>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`p-2 rounded-full transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${scrolled ? 'text-foreground/40 hover:text-red-400 hover:bg-red-400/10' : 'text-white/40 hover:text-red-400 hover:bg-white/10'}`}
                    title="Logout"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md text-xs font-bold transition-all ${scrolled ? 'bg-foreground/5 border-foreground/10 text-foreground/70 hover:bg-foreground/10 hover:text-foreground' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white'}`}
                >
                  <LogIn className="w-4 h-4" />
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