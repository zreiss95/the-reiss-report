import axios from "axios";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function getWeekGames(
  week?: number,
  season: number = 2026
) {
  // ESPN expects the season year in the `dates` parameter. The previous
  // `season=2026` URL returned empty schedules for specific weeks, which made
  // Weeks 1-5 appear to have no picks/logos.
  const url = week
    ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${season}&seasontype=2&week=${week}`
    : (() => {
        // Search today through the next six days so Friday/Saturday visitors
        // still resolve to the upcoming NFL week.
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
