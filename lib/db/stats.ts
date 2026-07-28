import { supabase } from "@/lib/supabase";


function safeNumber(
  value: any
) {

  const num =
    Number(value);

  return Number.isFinite(num)
    ? num
    : 0;

}



function calculatePercentage(
  wins: number,
  losses: number
) {

  const total =
    wins + losses;


  if (total === 0) {
    return 0;
  }


  return Math.round(
    (wins / total) * 100
  );

}



export async function getSeasonStats() {

  const { data: picks, error } =
    await supabase
      .from("picks")
      .select(
        `
        moneylineresult,
        atsresult,
        totalresult
        `
      );


  if (error) {
    throw error;
  }



  const rows =
    picks ?? [];



  const mlWins =
    rows.filter(
      (row: any) =>
        row.moneylineresult === "WIN"
    ).length;


  const mlLosses =
    rows.filter(
      (row: any) =>
        row.moneylineresult === "LOSS"
    ).length;



  const atsWins =
    rows.filter(
      (row: any) =>
        row.atsresult === "WIN"
    ).length;


  const atsLosses =
    rows.filter(
      (row: any) =>
        row.atsresult === "LOSS"
    ).length;


  const atsPushes =
    rows.filter(
      (row: any) =>
        row.atsresult === "PUSH"
    ).length;



  const totalWins =
    rows.filter(
      (row: any) =>
        row.totalresult === "WIN"
    ).length;


  const totalLosses =
    rows.filter(
      (row: any) =>
        row.totalresult === "LOSS"
    ).length;


  const totalPushes =
    rows.filter(
      (row: any) =>
        row.totalresult === "PUSH"
    ).length;



  return {

    moneyline: {

      wins:
        mlWins,

      losses:
        mlLosses,

      total:
        mlWins + mlLosses,

      pct:
        calculatePercentage(
          mlWins,
          mlLosses
        ),

    },


    ats: {

      wins:
        atsWins,

      losses:
        atsLosses,

      pushes:
        atsPushes,

      total:
        atsWins +
        atsLosses +
        atsPushes,

      pct:
        calculatePercentage(
          atsWins,
          atsLosses
        ),

    },


    total: {

      wins:
        totalWins,

      losses:
        totalLosses,

      pushes:
        totalPushes,

      total:
        totalWins +
        totalLosses +
        totalPushes,

      pct:
        calculatePercentage(
          totalWins,
          totalLosses
        ),

    },

  };

}



export async function getFeaturedStats(
  week?: number
) {


  let query =
    supabase
      .from("picks")
      .select(
        `
        week,
        featuredmoneyline,
        featuredats,
        featuredtotal,
        moneylineresult,
        atsresult,
        totalresult
        `
      );



  if (week !== undefined) {

    query =
      query.lte(
        "week",
        Number(week)
      );

  }



  const { data: picks, error } =
    await query;



  if (error) {
    throw error;
  }



  const rows =
    picks ?? [];



  const featured =
    (
      column: string,
      resultColumn: string
    ) => {

      return rows.filter(
        (row: any) =>
          row[column] === 1 &&
          row[resultColumn]
      );

    };



  const ml =
    featured(
      "featuredmoneyline",
      "moneylineresult"
    );


  const ats =
    featured(
      "featuredats",
      "atsresult"
    );


  const total =
    featured(
      "featuredtotal",
      "totalresult"
    );



  return {

    moneyline: {

      wins:
        ml.filter(
          (row:any)=>
            row.moneylineresult === "WIN"
        ).length,


      losses:
        ml.filter(
          (row:any)=>
            row.moneylineresult === "LOSS"
        ).length,

    },


    ats: {

      wins:
        ats.filter(
          (row:any)=>
            row.atsresult === "WIN"
        ).length,


      losses:
        ats.filter(
          (row:any)=>
            row.atsresult === "LOSS"
        ).length,


      pushes:
        ats.filter(
          (row:any)=>
            row.atsresult === "PUSH"
        ).length,

    },


    total: {

      wins:
        total.filter(
          (row:any)=>
            row.totalresult === "WIN"
        ).length,


      losses:
        total.filter(
          (row:any)=>
            row.totalresult === "LOSS"
        ).length,


      pushes:
        total.filter(
          (row:any)=>
            row.totalresult === "PUSH"
        ).length,

    },

  };

}