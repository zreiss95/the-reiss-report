import Link from "next/link";
import FeatureCard from "../lib/components/FeatureCard";
import { getSeasonStats, getFeaturedStats } from "../lib/db/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [seasonStats, featuredStats] = await Promise.all([
    getSeasonStats(),
    getFeaturedStats(),
  ]);

  const overallWins =
    seasonStats.moneyline.wins + seasonStats.ats.wins + seasonStats.total.wins;
  const overallLosses =
    seasonStats.moneyline.losses + seasonStats.ats.losses + seasonStats.total.losses;

  const bestBetWins =
    featuredStats.moneyline.wins + featuredStats.ats.wins + featuredStats.total.wins;
  const bestBetLosses =
    featuredStats.moneyline.losses + featuredStats.ats.losses + featuredStats.total.losses;

  const stats = [
    ["Overall Record", `${overallWins}-${overallLosses}`],
    ["Best Bets", `${bestBetWins}-${bestBetLosses}`],
    ["Survivor", "0-0"],
    ["ATS Record", `${seasonStats.ats.wins}-${seasonStats.ats.losses}`],
  ];

  return (
    <main className="home-page">
      {/* Full Page Colts Watermark */}
      <div className="home-watermark" aria-hidden="true">
        <img src="/logos/colts-logo.png" alt="" />
      </div>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-tint" aria-hidden="true" />
        <div className="home-hero-content">
          <h1>The Reiss Report</h1>
          <p>NFL Picks • Survivor • Best Bets • Rankings • Fantasy</p>

          <div className="home-hero-actions">
            <Link href="/weekly-picks" className="home-button home-button-primary">
              View Weekly Picks
            </Link>
            <Link href="/rankings" className="home-button home-button-secondary">
              Power Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-section home-stats" aria-label="Current records">
        <div className="home-grid home-grid-stats">
          {stats.map(([title, value]) => (
            <div key={title} className="home-stat-card">
              <div className="home-stat-title">{title}</div>
              <div className="home-stat-value">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-section home-features">
        <h2>Everything You Need</h2>

        <div className="home-grid home-grid-features">
          <FeatureCard
            title="Weekly Picks"
            description="Weekly NFL game predictions against the spread and straight up."
            href="/weekly-picks"
          />

          <FeatureCard
            title="Survivor Picks"
            description="Safest survivor selections every NFL week."
            href="/survivor"
          />

          <FeatureCard
            title="Loser Survivor"
            description="Reverse survivor selections each week."
            href="/loser-survivor"
          />

          <FeatureCard
            title="Power Rankings"
            description="Rankings including QB, RB, WR, TE, K, DEF and Team Rankings."
            href="/rankings"
          />

          <FeatureCard
            title="Fantasy Rankings"
            description="Fantasy football rankings, ADP comparisons, tiers and draft boards."
            href="/fantasy"
          />

          <FeatureCard
            title="DFS"
            description="Daily Fantasy tools and projections."
            disabled
          />
        </div>
      </section>
    </main>
  );
}
