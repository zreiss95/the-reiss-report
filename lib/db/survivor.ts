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
      "Invalid survivor data."
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

    updatedAt:
      new Date().toISOString(),

  };

}



async function saveSurvivorTable(
  table: string,
  data: any
) {

  const row =
    validateSurvivorData(data);



  const { error } =
    await supabase
      .from(table)
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



export async function saveSurvivor(
  data: any
) {

  return saveSurvivorTable(
    "survivor",
    data
  );

}



export async function getSurvivor(
  week: number
) {

  const { data, error } =
    await supabase
      .from("survivor")
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



export async function getAllSurvivor() {

  const { data, error } =
    await supabase
      .from("survivor")
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



export async function getAvailableSurvivorWeeks() {

  const { data, error } =
    await supabase
      .from("survivor")
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



export async function saveSurvivorRemaining(
  data: any
) {

  return saveSurvivorTable(
    "survivor_remaining",
    data
  );

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