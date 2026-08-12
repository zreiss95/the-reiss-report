"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import HeaderAuth from "./HeaderAuth";

const links = [
  ["Home", "/"],
  ["Weekly Picks", "/weekly-picks"],
  ["Survivor", "/survivor"],
  ["Loser Survivor", "/loser-survivor"],
  ["Player Rankings", "/rankings/players"],
  ["Team Rankings", "/rankings/team"],
  ["Fantasy ADP", "/fantasy"],
] as const;

export default function PublicRouteSwitcher() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return null;
  }

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav-links">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>

      <div className="site-nav-auth">
        <HeaderAuth />
      </div>

      <button
        type="button"
        className="site-nav-mobile-trigger"
        aria-expanded={mobileOpen}
        aria-controls="mobile-site-navigation"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div id="mobile-site-navigation" className="site-nav-mobile-menu">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={closeMobileMenu}>
              {label}
            </Link>
          ))}
          <div className="site-nav-mobile-auth">
            <HeaderAuth />
          </div>
        </div>
      )}
    </nav>
  );
}
