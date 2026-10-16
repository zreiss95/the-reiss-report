import axios from "axios";

export async function getWeekGames(
  week?: number,
  season: number = 2026
) {
  // ESPN's bare scoreboard endpoint is the authoritative "current NFL week"
  // feed. Using `dates=2026` here can return no events on days without a game,
  // which makes pages incorrectly fall back to Week 1.
  const url = week
    ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}&season=${season}`
    : `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&season=${season}`;

  try {
    const response = await axios.get(url, {
      timeout: 10000,
    });

    return response.data.events ?? [];
  } catch (err) {
    return [];
  }
}
