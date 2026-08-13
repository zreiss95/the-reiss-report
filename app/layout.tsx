import "./globals.css";
import "./mobile-rankings.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import PublicRouteSwitcher from "@/components/PublicRouteSwitcher";

const siteUrl = "https://reissreport.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Reiss Report",
  description:
    "The Reiss Report — NFL picks, Survivor, fantasy football, rankings and best bets.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Reiss Report",
    description: "NFL picks, Survivor, fantasy football, rankings and best bets.",
    url: siteUrl,
    siteName: "The Reiss Report",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The Reiss Report",
    description: "NFL picks, Survivor, fantasy football, rankings and best bets.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Reiss Report",
  url: siteUrl,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Reiss Report",
  url: siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-M2W432NJJ9" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M2W432NJJ9');`}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <div className="site-content">
          <PublicRouteSwitcher />
          {children}
        </div>
      </body>
    </html>
  );
}
