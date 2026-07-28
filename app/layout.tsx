import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}