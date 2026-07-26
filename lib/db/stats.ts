import db from "./db";


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



export function getSeasonStats() {

  const ml =
    db.prepare(`
      SELECT

        SUM(moneylineResult = 'WIN') AS wins,

        SUM(moneylineResult = 'LOSS') AS losses

      FROM picks
    `)
    .get() as any;



  const ats =
    db.prepare(`
      SELECT

        SUM(atsResult = 'WIN') AS wins,

        SUM(atsResult = 'LOSS') AS losses,

        SUM(atsResult = 'PUSH') AS pushes

      FROM picks
    `)
    .get() as any;



  const total =
    db.prepare(`
      SELECT

        SUM(totalResult = 'WIN') AS wins,

        SUM(totalResult = 'LOSS') AS losses,

        SUM(totalResult = 'PUSH') AS pushes

      FROM picks
    `)
    .get() as any;



  const mlWins =
    safeNumber(ml.wins);

  const mlLosses =
    safeNumber(ml.losses);



  const atsWins =
    safeNumber(ats.wins);

  const atsLosses =
    safeNumber(ats.losses);

  const atsPushes =
    safeNumber(ats.pushes);



  const totalWins =
    safeNumber(total.wins);

  const totalLosses =
    safeNumber(total.losses);

  const totalPushes =
    safeNumber(total.pushes);



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



export function getFeaturedStats(
  week?: number
) {


  const where =
    week !== undefined
      ? "WHERE week <= ?"
      : "";


  const params =
    week !== undefined
      ? [Number(week)]
      : [];



  const ml =
    db.prepare(`
      SELECT

        SUM(
          CASE
            WHEN featuredMoneyline = 1
            AND moneylineResult = 'WIN'
            THEN 1
            ELSE 0
          END
        ) AS wins,


        SUM(
          CASE
            WHEN featuredMoneyline = 1
            AND moneylineResult = 'LOSS'
            THEN 1
            ELSE 0
          END
        ) AS losses


      FROM picks

      ${where}

    `)
    .get(...params) as any;



  const ats =
    db.prepare(`
      SELECT

        SUM(
          CASE
            WHEN featuredATS = 1
            AND atsResult = 'WIN'
            THEN 1
            ELSE 0
          END
        ) AS wins,


        SUM(
          CASE
            WHEN featuredATS = 1
            AND atsResult = 'LOSS'
            THEN 1
            ELSE 0
          END
        ) AS losses,


        SUM(
          CASE
            WHEN featuredATS = 1
            AND atsResult = 'PUSH'
            THEN 1
            ELSE 0
          END
        ) AS pushes


      FROM picks

      ${where}

    `)
    .get(...params) as any;



  const total =
    db.prepare(`
      SELECT

        SUM(
          CASE
            WHEN featuredTotal = 1
            AND totalResult = 'WIN'
            THEN 1
            ELSE 0
          END
        ) AS wins,


        SUM(
          CASE
            WHEN featuredTotal = 1
            AND totalResult = 'LOSS'
            THEN 1
            ELSE 0
          END
        ) AS losses,


        SUM(
          CASE
            WHEN featuredTotal = 1
            AND totalResult = 'PUSH'
            THEN 1
            ELSE 0
          END
        ) AS pushes


      FROM picks

      ${where}

    `)
    .get(...params) as any;



  return {

    moneyline: {

      wins:
        safeNumber(ml.wins),

      losses:
        safeNumber(ml.losses),

    },


    ats: {

      wins:
        safeNumber(ats.wins),

      losses:
        safeNumber(ats.losses),

      pushes:
        safeNumber(ats.pushes),

    },


    total: {

      wins:
        safeNumber(total.wins),

      losses:
        safeNumber(total.losses),

      pushes:
        safeNumber(total.pushes),

    },

  };

}