import db from "../db/db";

const POSITIONS = ["QB", "RB", "WR", "TE", "K", "DT", "DE", "LB", "CB", "S"];

export async function importPlayers() {
  for (const position of POSITIONS) {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/athletes?limit=300&position=${position}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data.athletes) continue;

    for (const player of data.athletes) {
      db.prepare(`
        INSERT OR REPLACE INTO players (
          playerId,
          name,
          team,
          position,
          headshot,
          active
        )
        VALUES (
          ?, ?, ?, ?, ?, 1
        )
      `).run(
        player.id,
        player.displayName,
        player.team?.abbreviation ?? "",
        player.position?.abbreviation ?? "",
        player.headshot?.href ?? ""
      );
    }
  }
}