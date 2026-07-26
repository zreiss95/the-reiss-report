import db from "../lib/db/db";
import { importNFLFantasy } from "../lib/importers/nfl/fantasy";

async function run() {
  const rankings = await importNFLFantasy("QB");

  const update = db.prepare(`
    UPDATE player_rankings
    SET consensusRank = ?
    WHERE player LIKE ?
      AND position='QB'
      AND season=2025
  `);

  rankings.forEach((player) => {
    update.run(
      player.consensusRank,
      `%${player.player}%`
    );
  });
}

run();