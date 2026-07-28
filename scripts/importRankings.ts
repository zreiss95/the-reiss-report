import { supabase } from "../lib/supabase";
import { importQBRankings } from "../lib/importers/nfl/qb";

async function run() {
  const rankings = await importQBRankings();

  for (const player of rankings) {
    const { error } = await supabase
      .from("player_rankings")
      .update({
        consensusRank: player.consensusRank,
      })
      .eq(
        "player",
        player.player
      )
      .eq(
        "season",
        2025
      );

    if (error) {
      console.error(
        `Failed updating ${player.player}`,
        error
      );
    }
  }

  
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });