import { supabase } from "@/lib/supabase";


function validateData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid loser survivor remaining data."
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

  };

}



export async function saveLoserSurvivorRemaining(
  data: any
) {

  const row =
    validateData(data);



  const { error } = await supabase
    .from("loser_survivor_remaining")
    .upsert(
      {
        ...row,

        updatedAt:
          new Date().toISOString(),

      },
      {
        onConflict:
          "week,rank",
      }
    );



  if (error) {
    throw error;
  }

}



export async function getLoserSurvivorRemaining(
  week: number
) {

  const { data, error } = await supabase
    .from("loser_survivor_remaining")
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



export async function getAllLoserSurvivorRemaining() {

  const { data, error } = await supabase
    .from("loser_survivor_remaining")
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



export async function getAvailableLoserSurvivorRemainingWeeks() {

  const { data, error } = await supabase
    .from("loser_survivor_remaining")
    .select("week");


  if (error) {
    throw error;
  }



  return [
    ...new Set(
      (data ?? [])
        .map((row: any) => row.week)
        .filter(
          (week) =>
            week !== null &&
            week !== undefined
        )
    ),
  ]
    .sort(
      (a, b) =>
        Number(b) - Number(a)
    );

}