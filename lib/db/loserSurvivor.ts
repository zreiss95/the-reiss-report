import { supabase } from "@/lib/supabase";


function formatTeamName(name: any) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function validateSurvivorData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid loser survivor data."
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
      formatTeamName(data.team),

    opponent:
      formatTeamName(data.opponent),

    confidence:
      Number(data.confidence ?? 0),

    analysis:
      String(data.analysis ?? "")
        .trim(),

    kickoff:
      String(data.kickoff ?? "")
        .trim(),

    status:
      String(data.status ?? "Draft")
        .trim(),

  };

}



async function saveLoserSurvivorTable(
  table: string,
  data: any
) {

  const row =
    validateSurvivorData(data);



  const { error } = await supabase
    .from(table)
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



export async function saveLoserSurvivor(
  data: any
) {

  await saveLoserSurvivorTable(
    "loser_survivor",
    data
  );

}



export async function saveLoserSurvivorRemaining(
  data: any
) {

  await saveLoserSurvivorTable(
    "loser_survivor_remaining",
    data
  );

}



export async function getLoserSurvivor(
  week: number
) {

  const { data, error } = await supabase
    .from("loser_survivor")
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



export async function getAllLoserSurvivor() {

  const { data, error } = await supabase
    .from("loser_survivor")
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



export async function getAvailableLoserSurvivorWeeks() {

  const { data: survivor, error: survivorError } =
    await supabase
      .from("loser_survivor")
      .select("week");


  if (survivorError) {
    throw survivorError;
  }



  const { data: remaining, error: remainingError } =
    await supabase
      .from("loser_survivor_remaining")
      .select("week");


  if (remainingError) {
    throw remainingError;
  }



  const weeks = [
    ...(survivor ?? []),
    ...(remaining ?? []),
  ]
    .map((row: any) => row.week)
    .filter(
      (week) => week !== null && week !== undefined
    );



  return [
    ...new Set(weeks),
  ]
    .sort(
      (a, b) => Number(b) - Number(a)
    );

}