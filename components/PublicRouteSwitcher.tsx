"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PublicRouteSwitcher() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
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
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/survivor">Survivor</Link>
      <Link href="/loser-survivor">Loser Survivor</Link>
      <Link href="/rankings/players">Player Rankings</Link>
      <Link href="/rankings/team">Team Rankings</Link>
      <Link href="/fantasy">Fantasy ADP</Link>
    </div>
  );
}