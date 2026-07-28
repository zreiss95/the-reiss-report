import { supabase } from "@/lib/supabase";


function validatePickData(data: any) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid pick data."
    );
  }


  if (!data.gameId) {
    throw new Error(
      "Game ID is required."
    );
  }


  return {

    gameid:
      String(data.gameId)
        .trim(),

    week:
      Number(data.week ?? 0),


    away:
      String(data.away ?? "")
        .trim(),


    home:
      String(data.home ?? "")
        .trim(),


    awaylogo:
      data.awayLogo ?? null,


    homelogo:
      data.homeLogo ?? null,


    moneylinepick:
      String(data.moneylinePick ?? "")
        .trim(),


    atspick:
      String(data.atsPick ?? "")
        .trim(),


    spread:
      Number(data.spread ?? 0),


    totalpick:
      String(data.totalPick ?? "")
        .trim(),


    totalline:
      Number(data.totalLine ?? 0),


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


    featuredmoneyline:
      data.featuredMoneyline ? 1 : 0,


    featuredats:
      data.featuredATS ? 1 : 0,


    featuredtotal:
      data.featuredTotal ? 1 : 0,

  };

}



export async function savePick(
  data: any
) {

  const row =
    validatePickData(data);


  const { error } =
    await supabase
      .from("picks")
      .upsert(
        {
          ...row,

          updatedat:
            new Date().toISOString(),

        },
        {
          onConflict:
            "gameid",
        }
      );


  if (error) {
    throw error;
  }

}



export async function getPicks(
  week?: number
) {

  let query =
    supabase
      .from("picks")
      .select("*")
      .order(
        "week",
        {
          ascending: false,
        }
      )
      .order(
        "away",
        {
          ascending: true,
        }
      );


  if (week !== undefined) {

    query =
      query.eq(
        "week",
        Number(week)
      );

  }


  const { data, error } =
    await query;


  if (error) {
    throw error;
  }


  return data ?? [];

}



export async function getPick(
  gameId: string
) {

  if (!gameId) {
    return null;
  }


  const { data, error } =
    await supabase
      .from("picks")
      .select("*")
      .eq(
        "gameid",
        gameId.trim()
      )
      .limit(1)
      .maybeSingle();


  if (error) {
    throw error;
  }


  return data;

}



export async function getFeaturedPicks(
  week?: number
) {

  const getFeatured = async (
    column: string
  ) => {

    let query =
      supabase
        .from("picks")
        .select("*")
        .eq(
          column,
          1
        )
        .limit(1);


    if (week !== undefined) {

      query =
        query.eq(
          "week",
          Number(week)
        );

    } else {

      query =
        query.order(
          "week",
          {
            ascending:false,
          }
        );

    }


    const { data, error } =
      await query;


    if (error) {
      throw error;
    }


    return data?.[0] ?? null;

  };


  return {

    moneyline:
      await getFeatured(
        "featuredmoneyline"
      ),


    ats:
      await getFeatured(
        "featuredats"
      ),


    total:
      await getFeatured(
        "featuredtotal"
      ),

  };

}



export async function getAvailableWeeks() {

  const { data, error } =
    await supabase
      .from("picks")
      .select("week")
      .order(
        "week",
        {
          ascending:false,
        }
      );


  if (error) {
    throw error;
  }


  return [
    ...new Set(
      (data ?? [])
        .map(
          (row:any)=>
            row.week
        )
        .filter(
          (week)=>
            week !== null &&
            week !== undefined
        )
    ),
  ];

}