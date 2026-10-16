import axios from "axios";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function getWeekGames(
  week?: number,
  season: number = 2026
) {
  const url = week
    ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}&season=${season}`
    : (() => {
        const start = new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&dates=${formatDate(start)}-${formatDate(end)}`;
      })();

  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data.events ?? [];
  } catch (err) {
    return [];
  }
}
