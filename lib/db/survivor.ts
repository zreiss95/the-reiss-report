import db from "./db";


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

  };

}



function saveSurvivorTable(
  table: string,
  data: any
) {

  const row =
    validateSurvivorData(data);



  db.prepare(`
    INSERT INTO ${table} (

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



export function saveSurvivor(
  data: any
) {

  saveSurvivorTable(
    "survivor",
    data
  );

}



export function getSurvivor(
  week: number
) {

  return db.prepare(`
    SELECT *

    FROM survivor

    WHERE week = ?

    ORDER BY rank ASC

  `)
  .all(
    Number(week)
  );

}



export function getAllSurvivor() {

  return db.prepare(`
    SELECT *

    FROM survivor

    ORDER BY week DESC, rank ASC

  `)
  .all();

}



export function getAvailableSurvivorWeeks() {

  return db
    .prepare(`
      SELECT DISTINCT week

      FROM survivor

      ORDER BY week DESC

    `)
    .all()
    .map(
      (row: any) =>
        row.week
    );

}



export function saveSurvivorRemaining(
  data: any
) {

  saveSurvivorTable(
    "survivor_remaining",
    data
  );

}



export function getSurvivorRemaining(
  week: number
) {

  return db
    .prepare(`
      SELECT *

      FROM survivor_remaining

      WHERE week = ?

      ORDER BY rank ASC

    `)
    .all(
      Number(week)
    );

}