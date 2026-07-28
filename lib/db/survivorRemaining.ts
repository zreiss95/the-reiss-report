import { supabase } from "@/lib/supabase";


function validateSurvivorRemainingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid survivor remaining data."
    );
  }


  if (!data.week || !data.rank) {
    throw new Error(
      "Week and rank are required."
    );
  }


  return {

    week:
      Number(data.week),

    rank:
      Number(data.rank),

    gameId:
      String(data.gameId ?? "")
        .trim(),

    team:
      String(data.team ?? "")
        .toUpperCase()
        .trim(),

    opponent:
      String(data.opponent ?? "")
        .toUpperCase()
        .trim(),

    confidence:
      Number(data.confidence ?? 0),

    analysis:
      String(data.analysis ?? "")
        .trim(),

    kickoff:
      String(data.kickoff ?? "")
        .trim(),

    status:
      String(data.status ?? "draft")
        .trim(),

    updatedAt:
      new Date().toISOString(),

  };

}



export async function saveSurvivorRemaining(
  data: any
) {

  const row =
    validateSurvivorRemainingData(data);



  const { error } =
    await supabase
      .from("survivor_remaining")
      .upsert(
        row,
        {
          onConflict:
            "week,rank",
        }
      );



  if (error) {
    throw error;
  }


  return row;

}



export async function getSurvivorRemaining(
  week: number
) {

  const { data, error } =
    await supabase
      .from("survivor_remaining")
      .select("*")
      .eq(
        "week",
        Number(week)
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



export async function getAllSurvivorRemaining() {

  const { data, error } =
    await supabase
      .from("survivor_remaining")
      .select("*")
      .order(
        "week",
        {
          ascending: false,
        }
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



export async function getAvailableSurvivorRemainingWeeks() {

  const { data, error } =
    await supabase
      .from("survivor_remaining")
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