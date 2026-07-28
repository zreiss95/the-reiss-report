import { getWeekGames } from "../../lib/api/getWeekGames";
import {
  getLoserSurvivor,
  getLoserSurvivorRemaining,
} from "../../lib/db/loserSurvivor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SurvivorPage({
  searchParams,
}: {
  searchParams: {
    week?: string;
  };
}) {
  const currentWeek = 1;

  const currentGames = await getWeekGames(currentWeek);

  const week =
    Number(searchParams.week) || currentWeek;

  const games =
    week === currentWeek
      ? currentGames
      : await getWeekGames(week);


  function getTeamLogo(teamName: string) {
    if (!teamName) return "";

    const normalized =
      teamName
        .toLowerCase()
        .trim();


    for (const game of games) {

      const competition =
        game.competitions?.[0];

      if (!competition) continue;


      const teams =
        competition.competitors ?? [];


      for (const team of teams) {

        const display =
          team.team.displayName
            ?.toLowerCase()
            .trim();


        const short =
          team.team.shortDisplayName
            ?.toLowerCase()
            .trim();


        const abbreviation =
          team.team.abbreviation
            ?.toLowerCase()
            .trim();


        if (
          normalized === display ||
          normalized === short ||
          normalized === abbreviation
        ) {
          return team.team.logo ?? "";
        }


        if (
          display &&
          (
            display.includes(normalized) ||
            normalized.includes(display)
          )
        ) {
          return team.team.logo ?? "";
        }

      }

    }

    return "";
  }


  const overallPicks =
    await getLoserSurvivor(week);
console.log("LOSER SURVIVOR PAGE WEEK:", week);
console.log("LOSER SURVIVOR RESULTS:", overallPicks);

  const remainingPicks =
    await getLoserSurvivorRemaining(week);


  const availableWeeks =
    Array.from(
      { length: 18 },
      (_, i) => i + 1
    );


  function renderSection(
    title: string,
    picks: any[]
  ) {
    return (
      <>
        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginTop: 40,
            marginBottom: 24,
          }}
        >
          {title}
        </h2>


        {picks.length === 0 ? (
          <div
            style={{
              background: "#172036",
              border: "1px solid #24314f",
              borderRadius: 18,
              padding: 30,
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            No picks published yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 24,
            }}
          >

            {picks.map((pick: any) => {

              const heading =
                pick.rank === 1
                  ? "💀 Best Fade"
                  : pick.rank === 2
                  ? "☠️ 2nd Best Fade"
                  : "⚠️ Backup Fade";


              const headingColor =
                pick.rank === 1
                  ? "#ef4444"
                  : pick.rank === 2
                  ? "#f97316"
                  : "#eab308";


              const confidenceColor =
                pick.confidence >= 90
                  ? "#22c55e"
                  : pick.confidence >= 80
                  ? "#eab308"
                  : "#ef4444";


              return (
                <div
                  key={pick.rank}
                  style={{
                    background:
                      "linear-gradient(145deg,#172036,#111827)",
                    border:
                      "1px solid #2b3b60",
                    borderRadius: 22,
                    padding: 30,
                    boxShadow:
                      "0 18px 40px rgba(0,0,0,.35)",
                  }}
                >

                  <div
                    style={{
                      color: headingColor,
                      fontWeight: 800,
                      fontSize: 18,
                      marginBottom: 18,
                    }}
                  >
                    {heading}
                  </div>


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      marginBottom: 14,
                    }}
                  >

                    {getTeamLogo(pick.team) && (
                      <img
                        src={getTeamLogo(pick.team)}
                        alt={pick.team}
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                        }}
                      />
                    )}


                    <div>

                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 900,
                          lineHeight: 1.1,
                        }}
                      >
                        {pick.team}
                      </div>


                      <div
                        style={{
                          color: "#94a3b8",
                          marginTop: 4,
                          fontSize: 18,
                        }}
                      >
                        vs {pick.opponent}
                      </div>

                    </div>

                  </div>


                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 18,
                      padding: "8px 16px",
                      borderRadius: 999,
                      background: confidenceColor,
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {pick.confidence}% Confidence
                  </div>


                  <div
                    style={{
                      marginTop: 22,
                      padding: 20,
                      background: "#111827",
                      border:
                        "1px solid #24314f",
                      borderRadius: 14,
                      color: "#d1d5db",
                      lineHeight: 1.7,
                    }}
                  >
                    {pick.analysis}
                  </div>


                  <div
                    style={{
                      marginTop: 18,
                      color: "#94a3b8",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    Kickoff •{" "}
                    {pick.kickoff
                      ? new Date(
                          pick.kickoff
                        ).toLocaleString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )
                      : ""}
                  </div>


                </div>
              );
            })}

          </div>
        )}

      </>
    );
  }


  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: 20,
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
        💀 Loser Survivor Picks
      </h1>


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
            href={`/loser-survivor?week=${w}`}
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
          fontSize: 18,
          marginBottom: 40,
        }}
      >
        NFL Week {week}
      </p>


      {renderSection(
        "💀 Best Picks (Regardless of Week)",
        overallPicks
      )}


      {renderSection(
        "♻ Remaining Teams Only",
        remainingPicks
      )}

    </main>
  );
}