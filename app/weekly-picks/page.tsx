import PickCard from "../../lib/components/PickCard";
import {
  getPicks,
  getFeaturedPicks,
  getAvailableWeeks,
} from "../../lib/db/picks";
import { getWeekGames } from "../../lib/api/getWeekGames";
import { gradeWeek } from "../../lib/gradeWeek";
import SeasonRecord from "../../lib/components/SeasonRecord";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WeeklyPicks({
  searchParams,
}: {
  searchParams: {
    week?: string;
  };
}) {


  
const currentWeek = 1;

// Load current week games
const currentGames = await getWeekGames(currentWeek);



// Automatically grade current week
await gradeWeek(currentGames);

// Selected week defaults to Week 1
const week = Number(searchParams.week) || currentWeek;

// Load the selected week's schedule
const games =
  week === currentWeek
    ? currentGames
    : await getWeekGames(week);

// Grade the week being viewed as well. Previously only the hard-coded current
// week was graded, so featured records on other weekly pages could stay stale.
if (week !== currentWeek) {
  await gradeWeek(games);
}

// Database + schedules through the selected week. Records are calculated
// directly from ESPN final scores so they do not depend on stale result columns.
const recordWeeks = Array.from({ length: week }, (_, i) => i + 1);
const [savedPicks, allPicks, featured, recordSchedules, featuredByWeek] = await Promise.all([
  getPicks(week),
  getPicks(),
  getFeaturedPicks(week),
  Promise.all(recordWeeks.map((w) => w === week ? Promise.resolve(games) : getWeekGames(w))),
  Promise.all(recordWeeks.map((w) => getFeaturedPicks(w))),
]);

type RecordRow = { wins: number; losses: number; pushes: number };
const emptyRecord = (): RecordRow => ({ wins: 0, losses: 0, pushes: 0 });
const stats = {
  moneyline: { ...emptyRecord(), total: 0, pct: 0 },
  ats: { ...emptyRecord(), total: 0, pct: 0 },
  total: { ...emptyRecord(), total: 0, pct: 0 },
};
const featuredStats = {
  moneyline: emptyRecord(),
  ats: emptyRecord(),
  total: emptyRecord(),
};

const featuredKeys = new Set<string>();
featuredByWeek.forEach((item: any, index) => {
  const w = index + 1;
  if (item.moneyline?.gameid) featuredKeys.add(`${w}:moneyline:${item.moneyline.gameid}`);
  if (item.ats?.gameid) featuredKeys.add(`${w}:ats:${item.ats.gameid}`);
  if (item.total?.gameid) featuredKeys.add(`${w}:total:${item.total.gameid}`);
});

const add = (record: RecordRow, result: "WIN" | "LOSS" | "PUSH") => {
  if (result === "WIN") record.wins++;
  else if (result === "LOSS") record.losses++;
  else record.pushes++;
};

for (const pick of allPicks as any[]) {
  const w = Number(pick.week);
  if (!w || w > week) continue;
  const game = (recordSchedules[w - 1] ?? []).find((g: any) => String(g.id) === String(pick.gameid));
  if (!game || game.status?.type?.completed !== true) continue;

  const competition = game.competitions?.[0];
  const home = competition?.competitors?.find((x: any) => x.homeAway === "home");
  const away = competition?.competitors?.find((x: any) => x.homeAway === "away");
  if (!home || !away) continue;

  const homeScore = Number(home.score ?? 0);
  const awayScore = Number(away.score ?? 0);

  if (pick.moneylinepick && homeScore !== awayScore) {
    const winner = homeScore > awayScore ? home.team.displayName : away.team.displayName;
    const result: "WIN" | "LOSS" = winner === pick.moneylinepick ? "WIN" : "LOSS";
    add(stats.moneyline, result);
    if (featuredKeys.has(`${w}:moneyline:${pick.gameid}`)) add(featuredStats.moneyline, result);
  }

  if (pick.atspick && pick.spread !== null && pick.spread !== undefined && pick.spread !== "") {
    const spread = Number(pick.spread);
    let picked: number | null = null;
    let opponent: number | null = null;
    if (pick.atspick === home.team.displayName) {
      picked = homeScore + spread;
      opponent = awayScore;
    } else if (pick.atspick === away.team.displayName) {
      picked = awayScore + spread;
      opponent = homeScore;
    }
    if (picked !== null && opponent !== null) {
      const result: "WIN" | "LOSS" | "PUSH" = picked > opponent ? "WIN" : picked < opponent ? "LOSS" : "PUSH";
      add(stats.ats, result);
      if (featuredKeys.has(`${w}:ats:${pick.gameid}`)) add(featuredStats.ats, result);
    }
  }

  if (pick.totalpick && pick.totalline !== null && pick.totalline !== undefined && pick.totalline !== "") {
    const points = homeScore + awayScore;
    const line = Number(pick.totalline);
    const selection = String(pick.totalpick).toLowerCase();
    let result: "WIN" | "LOSS" | "PUSH" = "PUSH";
    if (selection === "over") result = points > line ? "WIN" : points < line ? "LOSS" : "PUSH";
    else if (selection === "under") result = points < line ? "WIN" : points > line ? "LOSS" : "PUSH";
    add(stats.total, result);
    if (featuredKeys.has(`${w}:total:${pick.gameid}`)) add(featuredStats.total, result);
  }
}

for (const key of ["moneyline", "ats", "total"] as const) {
  const record = stats[key];
  record.total = record.wins + record.losses + record.pushes;
  record.pct = record.wins + record.losses
    ? Math.round((record.wins / (record.wins + record.losses)) * 100)
    : 0;
}

const availableWeeks = Array.from({ length: 18 }, (_, i) => i + 1);



const featuredNormalized = {
  ...featured,

  moneyline: featured.moneyline
    ? {
        ...featured.moneyline,
        moneylinePick:
          featured.moneyline.moneylinepick,
      }
    : null,

  ats: featured.ats
    ? {
        ...featured.ats,
        atsPick:
          featured.ats.atspick,
      }
    : null,

  total: featured.total
    ? {
        ...featured.total,
        totalPick:
          featured.total.totalpick,
        totalLine:
          featured.total.totalline,
      }
    : null,
};
const picks =
  Object.fromEntries(
    savedPicks.map(
      (pick:any) => [

        pick.gameid,

        {
          ...pick,

          moneylinePick:
            pick.moneylinepick,

          atsPick:
            pick.atspick,

          totalPick:
            pick.totalpick,

          totalLine:
            pick.totalline,

          moneylineResult:
            pick.moneylineresult,

          atsResult:
            pick.atsresult,

          totalResult:
            pick.totalresult,

          homeScore:
            pick.homescore,

          awayScore:
            pick.awayscore,

        }

      ]
    )
  );

function getTeamLogo(teamName: string) {
  for (const game of games) {
    const competition = game.competitions[0];

    const home = competition.competitors.find(
      (c: any) => c.homeAway === "home"
    );

    const away = competition.competitors.find(
      (c: any) => c.homeAway === "away"
    );

    if (home.team.displayName === teamName) {
      return home.team.logo;
    }

    if (away.team.displayName === teamName) {
      return away.team.logo;
    }
  }

  return "";
}

return (
  <main
    style={{
      maxWidth: "1000px",
      margin: "40px auto",
      color: "white",
      padding: "20px",
    }}
  >
      <div style={{ marginBottom: 20 }}>
        <BackButton />
      </div>

      <h1
        style={{
          fontSize: 48,
          marginBottom: 10,
        }}
      >
        Weekly Picks
      </h1>

      {/* Season Record */}

      <SeasonRecord stats={stats} />
      {/* Featured Picks */}

{(featuredNormalized.moneyline || featuredNormalized.ats || featuredNormalized.total) && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 20,
      margin: "30px 0 40px",
      alignItems: "stretch",
    }}
  >
    {featuredNormalized.moneyline && (
      <div
       style={{
  background: "linear-gradient(145deg,#182743,#111827)",
  border: "1px solid #2d4d7a",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 18px 40px rgba(0,0,0,.35)",
  position: "relative",
  overflow: "hidden",

  minHeight: 220,
  display: "flex",
  flexDirection: "column",
}}
      >
        <div
  style={{
    position: "absolute",
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: "rgba(255,255,255,.05)",
  }}
/>
        <div
  style={{
    color: "#fbbf24",
    fontWeight: 800,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: ".5px",
    minHeight: 44,
    display: "flex",
    alignItems: "flex-start",
  }}
>
  🏆 Moneyline Pick of the Week
</div>

        <div
  style={{
    minHeight: 90,
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 18,
  }}
>
  <img
    src={getTeamLogo(featuredNormalized.moneyline.moneylinePick)}
    alt={featuredNormalized.moneyline.moneylinePick}
    style={{
      width: 56,
      height: 56,
      objectFit: "contain",
    }}
  />

  <div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        lineHeight: 1.1,
      }}
    >
      {featuredNormalized.moneyline.moneylinePick}
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginTop: 4,
      }}
    >
      over{" "}
      {featuredNormalized.moneyline.moneylinePick === featuredNormalized.moneyline.home
        ? featuredNormalized.moneyline.away
        : featuredNormalized.moneyline.home}
    </div>
  </div>
</div>

        <div
  style={{
    marginTop: "auto",
  }}
>

  <div
  style={{
    marginTop: 12,
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 600,
  }}
>
  Season Record:{" "}
  <span
    style={{
      color: "#fff",
      fontWeight: 800,
    }}
  >
    {featuredStats.moneyline.wins}-{featuredStats.moneyline.losses}
  </span>
</div>
</div>
</div>
    )}

    {featuredNormalized.ats && (
      <div
        style={{
  background: "linear-gradient(145deg,#182743,#111827)",
  border: "1px solid #2d4d7a",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 18px 40px rgba(0,0,0,.35)",
  position: "relative",
  overflow: "hidden",

  minHeight: 220,
  display: "flex",
  flexDirection: "column",
}}
      >
        <div
  style={{
    position: "absolute",
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: "rgba(255,255,255,.05)",
  }}
/>
        <div
  style={{
    color: "#22c55e",
    fontWeight: 800,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: ".5px",
    minHeight: 44,
    display: "flex",
    alignItems: "flex-start",
  }}
>
  ⭐ ATS Pick of the Week
</div>
        <div
  style={{
    minHeight: 90,
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 18,
  }}
>
  <img
    src={getTeamLogo(featuredNormalized.ats.atsPick)}
    alt={featuredNormalized.ats.atsPick}
    style={{
      width: 56,
      height: 56,
      objectFit: "contain",
    }}
  />

  <div>
    <div
  style={{
    fontSize: 26,
    fontWeight: 800,
    lineHeight: 1.1,
  }}
>
  {featuredNormalized.ats.atsPick}{" "}
  {featuredNormalized.ats.spread > 0 ? "+" : ""}
  {featuredNormalized.ats.spread}
</div>

<div
  style={{
    color: "#94a3b8",
    marginTop: 4,
  }}
>
  vs{" "}
  {featuredNormalized.ats.atsPick === featuredNormalized.ats.home
    ? featuredNormalized.ats.away
    : featuredNormalized.ats.home}
</div>
  </div>
</div>

        <div
  style={{
    marginTop: "auto",
  }}

>
  <div
    style={{
      marginTop: 12,
      color: "#94a3b8",
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    Season Record:{" "}
    <span
      style={{
        color: "#fff",
        fontWeight: 800,
      }}
    >
      {featuredStats.ats.wins}-{featuredStats.ats.losses}
      {featuredStats.ats.pushes
        ? `-${featuredStats.ats.pushes}`
        : ""}
    </span>
  </div>
</div>
      </div>
    )}

{featuredNormalized.total && (
  <div
    style={{
  background: "linear-gradient(145deg,#182743,#111827)",
  border: "1px solid #2d4d7a",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 18px 40px rgba(0,0,0,.35)",
  position: "relative",
  overflow: "hidden",

  minHeight: 220,
  display: "flex",
  flexDirection: "column",
}}
  >
    <div
      style={{
        position: "absolute",
        right: -30,
        top: -30,
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "rgba(255,255,255,.05)",
      }}
    />

    <div
  style={{
    color: "#38bdf8",
    fontWeight: 800,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: ".5px",
    minHeight: 44,
    display: "flex",
    alignItems: "flex-start",
  }}
>
  🎯 Total Pick of the Week
</div>

    <div
  style={{
    minHeight: 90,
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 18,
  }}
>
      <div
  style={{
    width: 56,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  }}
>
  <span
    style={{
      fontSize: 54,
      lineHeight: 1,
      color:
        featuredNormalized.total.totalPick === "Over"
          ? "#118524"
          : "#c75818",
    }}
  >
    {featuredNormalized.total.totalPick === "Over" ? "⬆" : "⬇"}
  </span>
</div>

      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {featuredNormalized.total.totalPick} {featuredNormalized.total.totalLine}
        </div>

        <div
          style={{
            color: "#94a3b8",
            marginTop: 4,
          }}
        >
          {featuredNormalized.total.away} @ {featuredNormalized.total.home}
        </div>
      </div>
    </div>

    <div style={{ marginTop: "auto" }}>


      <div
        style={{
          marginTop: 12,
          color: "#94a3b8",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Season Record:{" "}
        <span
          style={{
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {featuredStats.total.wins}-
          {featuredStats.total.losses}
          {featuredStats.total.pushes
            ? `-${featuredStats.total.pushes}`
            : ""}
        </span>
      </div>
    </div>
  </div>
)}
  </div>
)}
      

    <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 25,
  }}
>
  {availableWeeks.map((w: number) => (
    <a
      key={w}
      href={`/weekly-picks?week=${w}`}
      style={{
        padding: "8px 16px",
        borderRadius: 999,
        textDecoration: "none",
        background:
          week === w
            ? "#2563eb"
            : "#1e293b",
        color: "white",
        fontWeight: 700,
        transition: ".2s",
      }}
    >
      Week {w}
    </a>
  ))}
</div>

<p
  style={{
    color: "#94a3b8",
    marginBottom: 40,
  }}
>
  NFL Week {week}
</p>

      {games.map((game: any) => {
        const competition = game.competitions[0];

        const home = competition.competitors.find(
          (c: any) => c.homeAway === "home"
        );

        const away = competition.competitors.find(
          (c: any) => c.homeAway === "away"
        );

        const pick = picks[game.id];

        if (!pick) return null;

        // ATS display

        const spread = Number(pick.spread);

       const atsDisplay =
  pick.spread != null && pick.spread !== ""
    ? `${pick.atsPick} ${Number(pick.spread) > 0 ? "+" : ""}${pick.spread}`
    : pick.atsPick;

        // Kickoff

        const kickoff =
          competition.date || pick.kickoff || null;

        const kickoffDate = kickoff
          ? new Date(kickoff)
          : null;

        const locked =
  week === currentWeek &&
  kickoffDate &&
  new Date() >= kickoffDate;

        const kickoffDisplay = kickoffDate
          ? `${kickoffDate.toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/New_York",
            })} EST`
          : "";

        return (
          <PickCard
            key={game.id}
            away={away.team.displayName}
            awayLogo={away.team.logo}
            home={home.team.displayName}
            homeLogo={home.team.logo}
            moneylinePick={pick.moneylinePick}
            atsPick={atsDisplay}
            confidence={pick.confidence}
            line={kickoffDisplay}
            status={locked ? "Locked" : ""}
            analysis={pick.analysis}
            moneylineResult={pick.moneylineResult}
            atsResult={pick.atsResult}
            homeScore={pick.homeScore}
            awayScore={pick.awayScore}
            totalPick={pick.totalPick}
            totalLine={pick.totalLine}
          />
        );
      })}
    </main>
  );
}