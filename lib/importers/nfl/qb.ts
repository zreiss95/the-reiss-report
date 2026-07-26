import axios from "axios";
import * as fs from "fs";

export async function importQBRankings() {
  const url =
    "https://www.nfl.com/news/fantasy-football-qb-rankings-for-2026-nfl-season-draft-tiers-and-analysis";

  const { data } = await axios.get(url);

  fs.writeFileSync("nfl-qb.html", data);

  return [];
}