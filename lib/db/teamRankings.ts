import { supabase } from "@/lib/supabase";


const CURRENT_SEASON = 2026;



function validateTeamRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid team ranking data."
    );
  }


  if (!data.team) {
    throw new Error(
      "Team is required."
    );
  }


  return {

    team:
      String(data.team)
        .toUpperCase()
        .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    analysis:
      String(data.analysis ?? "")
        .trim(),

    favorite:
      data.favorite ? 1 : 0,

    locked:
      data.locked ? 1 : 0,

    lockedAt:
      data.lockedAt ?? null,

    season:
      Number(data.season ?? CURRENT_SEASON),

    updatedAt:
      new Date().toISOString(),

  };

}



export async function getTeamRankings(
  season = CURRENT_SEASON
) {

  const { data, error } =
    await supabase
      .from("team_rankings")
      .select("*")
      .eq(
        "season",
        Number(season)
      )
      .order(
        "myRank",
        {
          ascending: true,
        }
      );



  if (error) {
    throw error;
  }


  return data ?? [];

}



export async function saveTeamRanking(
  data: any
) {

  const row =
    validateTeamRankingData(data);



  const { error } =
    await supabase
      .from("team_rankings")
      .upsert(
        row,
        {
          onConflict:
            "team,season",
        }
      );



  if (error) {
    throw error;
  }


  return row;

}



export async function deleteTeamRanking(
  team: string,
  season = CURRENT_SEASON
) {

  if (!team) {
    throw new Error(
      "Team is required."
    );
  }



  const { error } =
    await supabase
      .from("team_rankings")
      .delete()
      .eq(
        "team",
        String(team)
          .toUpperCase()
          .trim()
      )
      .eq(
        "season",
        Number(season)
      );



  if (error) {
    throw error;
  }


  return true;

}