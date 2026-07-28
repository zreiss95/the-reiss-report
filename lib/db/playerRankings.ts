import { supabase } from "@/lib/supabase";


const CURRENT_SEASON = 2026;



function validateRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid ranking data."
    );
  }


  if (!data.player) {
    throw new Error(
      "Player name is required."
    );
  }


  return {

    player:
      String(data.player)
        .trim(),

    position:
      String(data.position ?? "")
        .toUpperCase()
        .trim(),

    team:
      String(data.team ?? "")
        .toUpperCase()
        .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? null),

    analysis:
      String(data.analysis ?? "")
        .trim(),

    season:
      Number(data.season ?? CURRENT_SEASON),

  };

}



export async function getRankings(
  position: string,
  season = CURRENT_SEASON
) {

  const normalizedPosition =
    String(position)
      .toUpperCase()
      .trim();



  const { data: rankings, error } =
    await supabase
      .from("player_rankings")
      .select("*")
      .eq(
        "position",
        normalizedPosition
      )
      .eq(
        "season",
        Number(season)
      )
      .order(
        "consensusRank",
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order(
        "player",
        {
          ascending: true,
        }
      );



  if (error) {
    throw error;
  }



  if (!rankings || rankings.length === 0) {
    return [];
  }



  const playerNames =
    rankings.map(
      (player: any) =>
        player.player
    );



  const { data: players, error: playerError } =
    await supabase
      .from("players")
      .select(
        "name, headshot"
      )
      .in(
        "name",
        playerNames
      );



  if (playerError) {
    throw playerError;
  }



  return rankings.map(
    (ranking: any) => {

      const player =
        players?.find(
          (p: any) =>
            p.name === ranking.player
        );


      return {

        ...ranking,

        headshot:
          player?.headshot ?? null,

      };

    }
  );

}



export async function saveRanking(
  data: any
) {

  const row =
    validateRankingData(data);



  const { error } =
    await supabase
      .from("player_rankings")
      .upsert(
        {
          ...row,

          updatedAt:
            new Date().toISOString(),

        },
        {
          onConflict:
            "player,season",
        }
      );



  if (error) {
    throw error;
  }

}



export async function deleteRanking(
  player: string,
  season = CURRENT_SEASON
) {

  if (!player) {
    throw new Error(
      "Player name required."
    );
  }



  const { error } =
    await supabase
      .from("player_rankings")
      .delete()
      .eq(
        "player",
        player.trim()
      )
      .eq(
        "season",
        Number(season)
      );



  if (error) {
    throw error;
  }

}



export async function getPlayers(
  position: string
) {

  const { data, error } =
    await supabase
      .from("players")
      .select("*")
      .eq(
        "position",
        String(position)
          .toUpperCase()
          .trim()
      )
      .order(
        "name",
        {
          ascending: true,
        }
      );



  if (error) {
    throw error;
  }



  return data ?? [];

}