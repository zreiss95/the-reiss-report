import { getWeekGames } from "../../lib/api/getWeekGames";

export default async function SchedulePage() {
  const games = await getWeekGames();

  return (
    <main
      style={{
        padding: 40,
        color: "white",
      }}
    >
      <h1>Week Schedule</h1>

      {games.map((game: any) => {
        const competition = game.competitions[0];

        const home = competition.competitors.find(
          (c: any) => c.homeAway === "home"
        );

        const away = competition.competitors.find(
          (c: any) => c.homeAway === "away"
        );

        return (
          <div
            key={game.id}
            style={{
              marginBottom: 18,
              padding: 20,
              border: "1px solid #333",
              borderRadius: 12,
            }}
          >
            {away.team.displayName} @ {home.team.displayName}
          </div>
        );
      })}
    </main>
  );
}