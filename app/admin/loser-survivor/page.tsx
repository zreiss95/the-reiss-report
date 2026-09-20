import { getWeekGames } from "../../../lib/api/getWeekGames";
import SurvivorPicker from "../../../lib/components/SurvivorPicker";
import {
  getLoserSurvivor,
  getLoserSurvivorRemaining,
} from "../../../lib/db/loserSurvivor";

export default async function AdminLoserSurvivorPage({
  searchParams,
}: {
  searchParams: {
    week?: string;
  };
}) {
  // Always request the exact week. The season-wide scoreboard endpoint can
  // include games from multiple weeks, which made the picker show extra games.
  const currentWeek = 1;
  const week = Number(searchParams.week) || currentWeek;
  const games = await getWeekGames(week);


  const savedOverall =
    await getLoserSurvivor(week);


  const savedRemaining =
    await getLoserSurvivorRemaining(week);

  // Teams Selected should represent teams already used before the week being
  // viewed, not the current week's #1 pick.
  const previousWeekPicks = week > 1
    ? (await Promise.all(
        Array.from({ length: week - 1 }, (_, index) => getLoserSurvivor(index + 1))
      )).flat()
    : [];

  const selectedTeams = previousWeekPicks
    .filter((pick: any) => Number(pick.rank) === 1 && pick.team)
    .sort((a: any, b: any) => Number(a.week) - Number(b.week))
    .map((pick: any) => pick.team);


  const availableWeeks = Array.from(
    { length: 18 },
    (_, i) => i + 1
  );


  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        💀 Loser Survivor Admin
      </h1>


      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {availableWeeks.map((w) => (
          <a
            key={w}
            href={`/admin/loser-survivor?week=${w}`}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              background:
                week === w
                  ? "#dc2626"
                  : "#1e293b",
              color: "white",
              fontWeight: 700,
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


      <div
        style={{
          display: "grid",
          gap: 50,
        }}
      >
        <SurvivorPicker
          title="💀 Best Picks (Regardless of Week)"
          apiRoute="/api/loser-survivor"
          buttonText="Save Overall Picks"
          games={games}
          saved={savedOverall}
        />


        <div style={{ padding: 20, background: "#111827", border: "1px solid #2b3b60", borderRadius: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 10 }}>Teams Selected</h2>
          <div style={{ color: "#cbd5e1", fontWeight: 700 }}>
            {selectedTeams.length ? selectedTeams.join(", ") : "No #1 pick selected yet."}
          </div>
        </div>

        <SurvivorPicker
          title="♻ Remaining Teams Only"
          apiRoute="/api/loser-survivor-remaining"
          buttonText="Save Remaining Picks"
          games={games}
          saved={savedRemaining}
        />
      </div>
    </main>
  );
}