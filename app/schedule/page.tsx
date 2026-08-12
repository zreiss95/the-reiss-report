import { getWeekGames } from "../../lib/api/getWeekGames";

export default async function SchedulePage() {
  const games = await getWeekGames();

  return (
    <main className="schedule-page">
      <h1>Week Schedule</h1>
      <div className="schedule-list">
        {games.map((game: any) => {
          const competition = game.competitions[0];
          const home = competition.competitors.find((c: any) => c.homeAway === "home");
          const away = competition.competitors.find((c: any) => c.homeAway === "away");
          return (
            <div className="schedule-game" key={game.id}>
              <span>{away.team.displayName}</span>
              <span className="schedule-at">@</span>
              <span>{home.team.displayName}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
