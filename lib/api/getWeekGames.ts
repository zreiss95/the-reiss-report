import axios from "axios";


export async function getWeekGames(
  week?: number,
  season: number = 2026
) {

  const url = week
    ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}&dates=${season}`
    : `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${season}`;



  try {

    const response = await axios.get(url, {
      timeout: 10000,
    });


    return response.data.events ?? [];


  } catch (err) {

    return [];

  }

}