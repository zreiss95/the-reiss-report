import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Reiss Report",
  description:
    "NFL Picks, Survivor, DFS, Fantasy Football and Rankings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
          <Link href="/rankings">Player Rankings</Link>
          <Link href="/team-rankings">Team Rankings</Link>
          <Link href="/fantasy">Fantasy ADP</Link>
        </div>

        {children}
      </body>
    </html>
  );
}