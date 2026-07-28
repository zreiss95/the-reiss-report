import { supabase } from "@/lib/supabase";


function validateRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid ranking data."
    );
  }


  if (
    !data.week ||
    !data.position ||
    !data.rank ||
    !data.playerName
  ) {
    throw new Error(
      "Week, position, rank, and player name are required."
    );
  }


  return {

    week:
      Number(data.week),

    position:
      String(data.position)
        .toUpperCase()
        .trim(),

    rank:
      Number(data.rank),

    playerName:
      String(data.playerName)
        .trim(),

    team:
      String(data.team ?? "")
        .toUpperCase()
        .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    notes:
      String(data.notes ?? "")
        .trim(),

    updatedAt:
      new Date().toISOString(),

  };

}



export async function saveRanking(
  data: any
) {

  const row =
    validateRankingData(data);



  const { error } =
    await supabase
      .from("rankings")
      .upsert(
        row,
        {
          onConflict:
            "week,position,rank",
        }
      );



  if (error) {
    throw error;
  }


  return row;

}



export async function getRankings(
  week: number,
  position: string
) {

  const { data, error } =
    await supabase
      .from("rankings")
      .select("*")
      .eq(
        "week",
        Number(week)
      )
      .eq(
        "position",
        String(position)
          .toUpperCase()
          .trim()
      )
      .order(
        "rank",
        {
          ascending: true,
        }
      );



  if (error) {
    throw error;
  }


  return data ?? [];

}



export async function getRankingPositions(
  week: number
) {

  const { data, error } =
    await supabase
      .from("rankings")
      .select("position")
      .eq(
        "week",
        Number(week)
      )
      .order(
        "position",
        {
          ascending: true,
        }
      );



  if (error) {
    throw error;
  }



  return [
    ...new Set(
      (data ?? [])
        .map(
          (row: any) =>
            row.position
        )
    ),
  ].map(
    (position) => ({
      position,
    })
  );

}



export async function getAvailableRankingWeeks() {

  const { data, error } =
    await supabase
      .from("rankings")
      .select("week")
      .order(
        "week",
        {
          ascending: false,
        }
      );



  if (error) {
    throw error;
  }



  return [
    ...new Set(
      (data ?? [])
        .map(
          (row: any) =>
            row.week
        )
    ),
  ];

}



export async function deleteRankings(
  week: number,
  position: string
) {

  const { error } =
    await supabase
      .from("rankings")
      .delete()
      .eq(
        "week",
        Number(week)
      )
      .eq(
        "position",
        String(position)
          .toUpperCase()
          .trim()
      );



  if (error) {
    throw error;
  }


  return true;

}