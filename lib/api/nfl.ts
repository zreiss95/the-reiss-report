import axios from "axios";

export async function getNFLSchedule() {
  const response = await axios.get(
    "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
  );

  return response.data;
}