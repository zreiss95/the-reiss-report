import { getWeekGames } from "../../../lib/api/getWeekGames";
import {
  getSurvivor,
  getSurvivorRemaining,
} from "../../../lib/db/survivor";
import SurvivorPicker from "../../../lib/components/SurvivorPicker";

export default async function SurvivorAdminPage({
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

  const savedOverall = getSurvivor(week);
const savedRemaining = getSurvivorRemaining(week);

  const availableWeeks = Array.from(
    { length: 18 },
    (_, i) => i + 1
  );

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: "20px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Survivor Admin
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
            href={`/admin/survivor?week=${w}`}
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
            }}
          >
            Week {w}
          </a>
        ))}
      </div>

      <p
        style={{
          color: "#94a3b8",
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        NFL Week {week}
      </p>

      <p
        style={{
          color: "#64748b",
          marginBottom: 36,
          maxWidth: 700,
          lineHeight: 1.6,
        }}
      >
        Select your three Survivor recommendations in order of confidence.
        Rank #1 will be displayed as your featured Favorite, while Ranks #2
        and #3 appear as alternative selections.
      </p>

      <div
        style={{
          background: "linear-gradient(145deg,#172036,#111827)",
          border: "1px solid #2b3b60",
          borderRadius: 22,
          padding: 30,
          boxShadow: "0 18px 40px rgba(0,0,0,.35)",
        }}
      >
        <div
  style={{
    display: "grid",
    gap: 50,
  }}
>
  <SurvivorPicker
    title="🏆 Best Picks (Regardless of Week)"
    apiRoute="/api/survivor"
    buttonText="Save Overall Picks"
    games={games}
    saved={savedOverall}
  />

  <SurvivorPicker
    title="♻ Remaining Teams Only"
    apiRoute="/api/survivor-remaining"
    buttonText="Save Remaining Picks"
    games={games}
    saved={savedRemaining}
  />
</div>
      </div>
    </main>
  );
}