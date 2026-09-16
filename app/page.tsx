import Link from "next/link";
import FeatureCard from "../lib/components/FeatureCard";
import { getSeasonStats, getFeaturedStats } from "../lib/db/stats";
import { getAllSurvivor } from "../lib/db/survivor";
import { getWeekGames } from "../lib/api/getWeekGames";
import { gradeWeek } from "../lib/gradeWeek";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // Grade every week that has started so the homepage record is always current.
  // gradeWeek skips games that ESPN does not mark completed.
  const weeks = Array.from({ length: 18 }, (_, index) => index + 1);
  const schedules = await Promise.all(weeks.map((week) => getWeekGames(week)));

  for (const games of schedules) {
    if (games.length > 0) {
      await gradeWeek(games);
    }
  }

  const [seasonStats, featuredStats, survivorPicks] = await Promise.all([
    getSeasonStats(),
    getFeaturedStats(),
    getAllSurvivor(),
  ]);

  const overallWins =
    seasonStats.moneyline.wins + seasonStats.ats.wins + seasonStats.total.wins;
  const overallLosses =
    seasonStats.moneyline.losses + seasonStats.ats.losses + seasonStats.total.losses;

  const bestBetWins =
    featuredStats.moneyline.wins + featuredStats.ats.wins + featuredStats.total.wins;
  const bestBetLosses =
    featuredStats.moneyline.losses + featuredStats.ats.losses + featuredStats.total.losses;

  // Survivor record is based on the #1 survivor pick for each week.
  // A survivor pick wins when its selected team wins that week's game.
  const survivorByWeek = new Map<number, any>();
  for (const pick of survivorPicks) {
    if (Number(pick.rank) === 1) {
      survivorByWeek.set(Number(pick.week), pick);
    }
  }

  let survivorWins = 0;
  let survivorLosses = 0;

  for (const [week, pick] of survivorByWeek.entries()) {
    const games = schedules[week - 1] ?? [];
    const game = games.find((item: any) => {
      if (pick.gameId && item.id === String(pick.gameId)) return true;
      if (pick.gameid && item.id === String(pick.gameid)) return true;

      const competitors = item.competitions?.[0]?.competitors ?? [];
      return competitors.some(
        (competitor: any) => competitor.team?.displayName === pick.team
      );
    });

    if (!game || game.status?.type?.completed !== true) continue;

    const competitors = game.competitions?.[0]?.competitors ?? [];
    const selected = competitors.find(
      (competitor: any) => competitor.team?.displayName === pick.team
    );

    if (!selected) continue;

    const selectedScore = Number(selected.score ?? 0);
    const opponent = competitors.find((competitor: any) => competitor !== selected);
    const opponentScore = Number(opponent?.score ?? 0);

    if (selectedScore > opponentScore) survivorWins += 1;
    else if (selectedScore < opponentScore) survivorLosses += 1;
  }

  const stats = [
    ["Overall Record", `${overallWins}-${overallLosses}`],
    ["Best Bets", `${bestBetWins}-${bestBetLosses}`],
    ["Survivor", `${survivorWins}-${survivorLosses}`],
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
