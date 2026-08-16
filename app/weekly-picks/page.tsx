import PickCard from "../../lib/components/PickCard";
import {
  getPicks,
  getFeaturedPicks,
  getAvailableWeeks,
} from "../../lib/db/picks";
import { getWeekGames } from "../../lib/api/getWeekGames";
import { gradeWeek } from "../../lib/gradeWeek";
import {
  getSeasonStats,
  getFeaturedStats,
} from "../../lib/db/stats";
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

// Database
const [
  savedPicks,
  stats,
  featuredStats,
  featured,
] = await Promise.all([
  getPicks(week),
  getSeasonStats(),
  getFeaturedStats(week),
  getFeaturedPicks(week),
]);

const availableWeeks = Array.from(
  { length: 18 },
  (_, i) => i + 1
);



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