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
  const currentGames = await getWeekGames();

  const currentWeek =
    currentGames[0]?.week?.number ?? 1;

  const week =
    Number(searchParams.week) || currentWeek;

  const games =
    week === currentWeek
      ? currentGames
      : await getWeekGames(week);

  const savedOverall = getLoserSurvivor(week);
  const savedRemaining = getLoserSurvivorRemaining(week);

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