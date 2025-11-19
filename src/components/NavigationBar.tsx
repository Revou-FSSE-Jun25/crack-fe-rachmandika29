"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [auth, setAuth] = useState<{ authenticated: boolean; role: "user" | "admin" | null; email: string | null } | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store", credentials: "include" });
        const json = await res.json();
        if (active) setAuth(json);
      } catch {
        if (active) setAuth({ authenticated: false, role: null, email: null });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    } finally {
      const role = auth?.role;
      setAuth({ authenticated: false, role: null, email: null });
      router.replace(role === "admin" ? "/admin/signin" : "/signin");
      setSigningOut(false);
    }
  };

  return (
    <nav className={`montserrat bg-black text-gray-200 border-b border-white/10 px-4 sm:px-6 py-3`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className={`zain-bold text-white text-xl tracking-wider`}>
          DAHA/R
        </Link>

        {/* Right: Desktop menu + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop menu (right-aligned) */}
          <ul className="hidden sm:flex list-none m-0 p-0 gap-3 font-medium">
            {auth?.authenticated ? (
              <>
                <li>
                  <Link
                    href={auth.role === "admin" ? "/admin" : "/dashboard"}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {auth.role === "admin" ? "Admin" : "Dashboard"}
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li>
                  <button
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signin" className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li>
                  <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile hamburger toggle (right side) */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 sm:hidden"
            aria-controls="mobile-menu"
            aria-expanded={open ? "true" : "false"}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            {/* Hamburger icon */}
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                // X icon
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                // Hamburger
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown (right-aligned) */}
      <div id="mobile-menu" className={`${open ? "block" : "hidden"} sm:hidden mt-2`}>
        <div className="flex justify-end">
          <ul className="flex flex-col list-none m-0 p-0 gap-2 font-medium text-right">
            {auth?.authenticated ? (
              <>
                <li>
                  <Link
                    href={auth.role === "admin" ? "/admin" : "/dashboard"}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {auth.role === "admin" ? "Admin" : "Dashboard"}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors text-right"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signin" className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}