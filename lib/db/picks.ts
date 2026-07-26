import db from "./db";


function validatePickData(
  data: any
) {

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

    gameId:
      String(data.gameId)
      .trim(),

    week:
      Number(data.week ?? 0),

    away:
      String(data.away ?? "")
      .toUpperCase()
      .trim(),

    home:
      String(data.home ?? "")
      .toUpperCase()
      .trim(),

    awayLogo:
      data.awayLogo ?? null,

    homeLogo:
      data.homeLogo ?? null,

    moneylinePick:
      String(data.moneylinePick ?? "")
      .trim(),

    atsPick:
      String(data.atsPick ?? "")
      .trim(),

    spread:
      Number(data.spread ?? 0),

    totalPick:
      String(data.totalPick ?? "")
      .trim(),

    totalLine:
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

    featuredMoneyline:
      data.featuredMoneyline ? 1 : 0,

    featuredATS:
      data.featuredATS ? 1 : 0,

    featuredTotal:
      data.featuredTotal ? 1 : 0,

  };

}



export function savePick(
  data: any
) {

  const row =
    validatePickData(data);



  db.prepare(
    `
    INSERT INTO picks (

      gameId,
      week,

      away,
      home,

      awayLogo,
      homeLogo,

      moneylinePick,
      atsPick,

      spread,

      totalPick,
      totalLine,

      confidence,

      analysis,

      kickoff,

      status,

      featuredMoneyline,
      featuredATS,
      featuredTotal,

      updatedAt

    )

    VALUES (

      @gameId,
      @week,

      @away,
      @home,

      @awayLogo,
      @homeLogo,

      @moneylinePick,
      @atsPick,

      @spread,

      @totalPick,
      @totalLine,

      @confidence,

      @analysis,

      @kickoff,

      @status,

      @featuredMoneyline,
      @featuredATS,
      @featuredTotal,

      datetime('now')

    )


    ON CONFLICT(gameId)

    DO UPDATE SET

      away = excluded.away,
      home = excluded.home,

      awayLogo = excluded.awayLogo,
      homeLogo = excluded.homeLogo,

      moneylinePick = excluded.moneylinePick,
      atsPick = excluded.atsPick,

      spread = excluded.spread,

      totalPick = excluded.totalPick,
      totalLine = excluded.totalLine,

      confidence = excluded.confidence,

      analysis = excluded.analysis,

      kickoff = excluded.kickoff,

      status = excluded.status,

      featuredMoneyline = excluded.featuredMoneyline,
      featuredATS = excluded.featuredATS,
      featuredTotal = excluded.featuredTotal,

      updatedAt = datetime('now')

    `
  )
  .run(row);

}



export function getPicks(
  week?: number
) {

  if (week !== undefined) {

    return db
      .prepare(
        `
        SELECT *
        FROM picks
        WHERE week = ?
        ORDER BY away ASC
        `
      )
      .all(
        Number(week)
      );

  }


  return db
    .prepare(
      `
      SELECT *
      FROM picks
      ORDER BY week DESC, away ASC
      `
    )
    .all();

}



export function getPick(
  gameId: string
) {

  if (!gameId) {
    return null;
  }


  return db
    .prepare(
      `
      SELECT *
      FROM picks
      WHERE gameId = ?
      LIMIT 1
      `
    )
    .get(
      gameId.trim()
    );

}



export function getFeaturedPicks(
  week?: number
): {
  moneyline: any;
  ats: any;
  total: any;
} {


  const getFeatured = (
    column: string
  ) => {

    if (week !== undefined) {

      return db
        .prepare(
          `
          SELECT *
          FROM picks
          WHERE ${column} = 1
          AND week = ?
          LIMIT 1
          `
        )
        .get(
          Number(week)
        );

    }


    return db
      .prepare(
        `
        SELECT *
        FROM picks
        WHERE ${column} = 1
        ORDER BY week DESC
        LIMIT 1
        `
      )
      .get();

  };


  return {

    moneyline:
      getFeatured(
        "featuredMoneyline"
      ),

    ats:
      getFeatured(
        "featuredATS"
      ),

    total:
      getFeatured(
        "featuredTotal"
      ),

  };

}



export function getAvailableWeeks() {

  return db
    .prepare(
      `
      SELECT DISTINCT week
      FROM picks
      ORDER BY week DESC
      `
    )
    .all()
    .map(
      (row: any) =>
        row.week
    );

}