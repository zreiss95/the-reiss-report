import db from "./db";


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



export function saveLoserSurvivorRemaining(
  data: any
) {

  const row =
    validateData(data);



  db.prepare(`
    INSERT INTO loser_survivor_remaining (

      week,
      rank,
      gameId,
      team,
      opponent,
      confidence,
      analysis,
      kickoff,
      status,
      updatedAt

    )

    VALUES (

      @week,
      @rank,
      @gameId,
      @team,
      @opponent,
      @confidence,
      @analysis,
      @kickoff,
      @status,
      datetime('now')

    )


    ON CONFLICT(week, rank)

    DO UPDATE SET

      gameId = excluded.gameId,
      team = excluded.team,
      opponent = excluded.opponent,
      confidence = excluded.confidence,
      analysis = excluded.analysis,
      kickoff = excluded.kickoff,
      status = excluded.status,
      updatedAt = datetime('now')

  `)
  .run(row);

}



export function getLoserSurvivorRemaining(
  week: number
) {

  return db.prepare(`
    SELECT *
    FROM loser_survivor_remaining
    WHERE week = ?
    ORDER BY rank ASC
  `)
  .all(
    Number(week)
  );

}



export function getAllLoserSurvivorRemaining() {

  return db.prepare(`
    SELECT *
    FROM loser_survivor_remaining
    ORDER BY week DESC, rank ASC
  `)
  .all();

}



export function getAvailableLoserSurvivorRemainingWeeks() {

  return db
    .prepare(`
      SELECT DISTINCT week
      FROM loser_survivor_remaining
      ORDER BY week DESC
    `)
    .all()
    .map(
      (row: any) =>
        row.week
    );

}