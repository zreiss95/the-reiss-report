import db from "../lib/db/db";
import { importQBRankings } from "../lib/importers/nfl/qb";

async function run() {
  const rankings = await importQBRankings();

  const update = db.prepare(`
    UPDATE player_rankings
    SET consensusRank = ?
    WHERE player = ?
      AND season = 2025
  `);

  for (const player of rankings) {
    update.run(
      player.consensusRank,
      player.player
    );
  }
}

run();