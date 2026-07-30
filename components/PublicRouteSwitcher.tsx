"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import HeaderAuth from "./HeaderAuth";

export default function PublicRouteSwitcher() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return null;
  }

  return (
    <div
      style={{
        padding: 20,
        borderBottom: "1px solid #24314f",
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Link href="/">Home</Link>

      <Link href="/weekly-picks">
        Weekly Picks
      </Link>

      <Link href="/survivor">
        Survivor
      </Link>

      <Link href="/loser-survivor">
        Loser Survivor
      </Link>

      <Link href="/rankings/players">
        Player Rankings
      </Link>

      <Link href="/rankings/team">
        Team Rankings
      </Link>

      <Link href="/fantasy">
        Fantasy ADP
      </Link>

      <div style={{ marginLeft: "auto" }}>
        <HeaderAuth />
      </div>
    </div>
  );
}