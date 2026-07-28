import { supabase } from "../lib/supabase";
import { importNFLFantasy } from "../lib/importers/nfl/fantasy";


async function run() {
  const rankings = await importNFLFantasy("QB");


  for (const player of rankings) {

    const {
      error,
    } = await supabase
      .from("player_rankings")
      .update({
        consensusRank:
          player.consensusRank,
      })
      .ilike(
        "player",
        `%${player.player}%`
      )
      .eq(
        "position",
        "QB"
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