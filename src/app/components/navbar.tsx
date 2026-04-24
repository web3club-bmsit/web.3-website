"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, ShieldAlert, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// NAV TABS (Contact added here)
// ─────────────────────────────────────────────────────────────
const NAV_TABS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Teams", href: "/teams" },
  { label: "Contact", href: "/contact" }, // ✅ added
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname(); // ✅ for active tab
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

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
      async (_event: string | undefined, session: Session | null) => {
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-b border-green-500/10 shadow-lg"
            : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-green-400 font-bold text-sm tracking-wider"
          >
            {"{ club }"}
          </Link>

          {/* Desktop tabs */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_TABS.map((tab) => (
              <li key={tab.label}>
                <Link
                  href={tab.href}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    pathname === tab.href
                      ? "text-green-400 bg-green-400/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
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

          {/* Auth State */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-tighter">
                    Authenticated
                  </span>
                  <span className="text-xs text-white/60 font-semibold max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="p-2 rounded-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/70 rounded-md text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login with Google
              </button>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-green-400 rounded transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-green-500/10 flex flex-col px-6 py-6 gap-3">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-semibold border-b border-white/5 transition-colors ${
                pathname === tab.href
                  ? "text-green-400"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-semibold text-yellow-400 border-b border-white/5 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}

          <div className="mt-4 pt-4 border-t border-white/5">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 uppercase font-mono">
                      Profile
                    </span>
                    <span className="text-xs text-white/70">
                      {user.email}
                    </span>
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
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-400 text-black rounded-md text-xs font-bold"
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