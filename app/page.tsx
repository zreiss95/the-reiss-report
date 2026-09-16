import Link from "next/link";
import FeatureCard from "../lib/components/FeatureCard";
import { getAllSurvivor } from "../lib/db/survivor";
import { getPicks, getFeaturedPicks } from "../lib/db/picks";
import { getWeekGames } from "../lib/api/getWeekGames";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Record = { wins: number; losses: number; pushes: number };

function emptyRecord(): Record {
  return { wins: 0, losses: 0, pushes: 0 };
}

function addResult(record: Record, result: "WIN" | "LOSS" | "PUSH") {
  if (result === "WIN") record.wins += 1;
  else if (result === "LOSS") record.losses += 1;
  else record.pushes += 1;
}

export default async function HomePage() {
  const weeks = Array.from({ length: 18 }, (_, index) => index + 1);
  const [schedules, picks, survivorPicks, featuredByWeek] = await Promise.all([
    Promise.all(weeks.map((week) => getWeekGames(week))),
    getPicks(),
    getAllSurvivor(),
    Promise.all(weeks.map((week) => getFeaturedPicks(week))),
  ]);

  // Best Bets must exactly mirror the three featured blocks shown on Weekly Picks:
  // one Moneyline, one ATS and one Total per week. getFeaturedPicks uses the same
  // selection logic as that page, so stale/duplicate featured flags cannot create
  // extra homepage bets.
  const featuredKeys = new Set<string>();
  featuredByWeek.forEach((featured: any, index) => {
    const week = index + 1;
    if (featured.moneyline?.gameid) featuredKeys.add(`${week}:moneyline:${featured.moneyline.gameid}`);
    if (featured.ats?.gameid) featuredKeys.add(`${week}:ats:${featured.ats.gameid}`);
    if (featured.total?.gameid) featuredKeys.add(`${week}:total:${featured.total.gameid}`);
  });

  const moneyline = emptyRecord();
  const ats = emptyRecord();
  const totals = emptyRecord();
  const bestBets = emptyRecord();

  for (const pick of picks as any[]) {
    const week = Number(pick.week);
    if (!week || week < 1 || week > 18) continue;

    const games = schedules[week - 1] ?? [];
    const game = games.find((item: any) => String(item.id) === String(pick.gameid));
    if (!game || game.status?.type?.completed !== true) continue;

    const competition = game.competitions?.[0];
    const home = competition?.competitors?.find((c: any) => c.homeAway === "home");
    const away = competition?.competitors?.find((c: any) => c.homeAway === "away");
    if (!home || !away) continue;

    const homeScore = Number(home.score ?? 0);
    const awayScore = Number(away.score ?? 0);

    if (pick.moneylinepick && homeScore !== awayScore) {
      const winner = homeScore > awayScore ? home.team.displayName : away.team.displayName;
      const result: "WIN" | "LOSS" = winner === pick.moneylinepick ? "WIN" : "LOSS";
      addResult(moneyline, result);
      if (featuredKeys.has(`${week}:moneyline:${pick.gameid}`)) addResult(bestBets, result);
    }

    if (pick.atspick && pick.spread !== null && pick.spread !== undefined && pick.spread !== "") {
      const spread = Number(pick.spread);
      let adjustedPickedScore: number | null = null;
      let opponentScore: number | null = null;

      if (pick.atspick === home.team.displayName) {
        adjustedPickedScore = homeScore + spread;
        opponentScore = awayScore;
      } else if (pick.atspick === away.team.displayName) {
        adjustedPickedScore = awayScore + spread;
        opponentScore = homeScore;
      }

      if (adjustedPickedScore !== null && opponentScore !== null) {
        const result: "WIN" | "LOSS" | "PUSH" =
          adjustedPickedScore > opponentScore ? "WIN" : adjustedPickedScore < opponentScore ? "LOSS" : "PUSH";
        addResult(ats, result);
        if (featuredKeys.has(`${week}:ats:${pick.gameid}`)) addResult(bestBets, result);
      }
    }

    if (pick.totalpick && pick.totalline !== null && pick.totalline !== undefined && pick.totalline !== "") {
      const points = homeScore + awayScore;
      const line = Number(pick.totalline);
      const selection = String(pick.totalpick).toLowerCase();
      let result: "WIN" | "LOSS" | "PUSH" = "PUSH";

      if (selection === "over") result = points > line ? "WIN" : points < line ? "LOSS" : "PUSH";
      else if (selection === "under") result = points < line ? "WIN" : points > line ? "LOSS" : "PUSH";

      addResult(totals, result);
      if (featuredKeys.has(`${week}:total:${pick.gameid}`)) addResult(bestBets, result);
    }
  }

  const survivorByWeek = new Map<number, any>();
  for (const pick of survivorPicks) {
    if (Number(pick.rank) === 1) survivorByWeek.set(Number(pick.week), pick);
  }

  let survivorWins = 0;
  let survivorLosses = 0;

  for (const [week, pick] of survivorByWeek.entries()) {
    const games = schedules[week - 1] ?? [];
    const game = games.find((item: any) => {
      if (pick.gameId && item.id === String(pick.gameId)) return true;
      if (pick.gameid && item.id === String(pick.gameid)) return true;
      const competitors = item.competitions?.[0]?.competitors ?? [];
      return competitors.some((c: any) => c.team?.displayName === pick.team);
    });

    if (!game || game.status?.type?.completed !== true) continue;
    const competitors = game.competitions?.[0]?.competitors ?? [];
    const selected = competitors.find((c: any) => c.team?.displayName === pick.team);
    if (!selected) continue;

    const opponent = competitors.find((c: any) => c !== selected);
    const selectedScore = Number(selected.score ?? 0);
    const opponentScore = Number(opponent?.score ?? 0);
    if (selectedScore > opponentScore) survivorWins += 1;
    else if (selectedScore < opponentScore) survivorLosses += 1;
  }

  const stats = [
    ["Overall Record", `${moneyline.wins}-${moneyline.losses}`],
    ["Best Bets", `${bestBets.wins}-${bestBets.losses}${bestBets.pushes ? `-${bestBets.pushes}` : ""}`],
    ["Survivor", `${survivorWins}-${survivorLosses}`],
    ["ATS Record", `${ats.wins}-${ats.losses}${ats.pushes ? `-${ats.pushes}` : ""}`],
  ];

  return (
    <main className="home-page">
      <div className="home-watermark" aria-hidden="true">
        <img src="/logos/colts-logo.png" alt="" />
      </div>

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

      <section className="home-section home-features">
        <h2>Everything You Need</h2>
        <div className="home-grid home-grid-features">
          <FeatureCard title="Weekly Picks" description="Weekly NFL game predictions against the spread and straight up." href="/weekly-picks" />
          <FeatureCard title="Survivor Picks" description="Safest survivor selections every NFL week." href="/survivor" />
          <FeatureCard title="Loser Survivor" description="Reverse survivor selections each week." href="/loser-survivor" />
          <FeatureCard title="Power Rankings" description="Rankings including QB, RB, WR, TE, K, DEF and Team Rankings." href="/rankings" />
          <FeatureCard title="Fantasy Rankings" description="Fantasy football rankings, ADP comparisons, tiers and draft boards." href="/fantasy" />
          <FeatureCard title="DFS" description="Daily Fantasy tools and projections." disabled />
        </div>
      </section>
    </main>
  );
}
