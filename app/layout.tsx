import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import PublicRouteSwitcher from "@/components/PublicRouteSwitcher";

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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M2W432NJJ9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M2W432NJJ9');
          `}
        </Script>

        <div className="site-content">
          <PublicRouteSwitcher />
          {children}
        </div>
      </body>
    </html>
  );
}