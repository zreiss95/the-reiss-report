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



function saveLoserSurvivorTable(
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

  `).run(row);

}



export function saveLoserSurvivor(
  data: any
) {

  saveLoserSurvivorTable(
    "loser_survivor",
    data
  );

}



export function saveLoserSurvivorRemaining(
  data: any
) {

  saveLoserSurvivorTable(
    "loser_survivor_remaining",
    data
  );

}



export function getLoserSurvivor(
  week: number
) {

  return db.prepare(`
    SELECT *
    FROM loser_survivor
    WHERE week = ?
    ORDER BY rank ASC
  `)
  .all(
    Number(week)
  );

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



export function getAllLoserSurvivor() {

  return db.prepare(`
    SELECT *
    FROM loser_survivor
    ORDER BY week DESC, rank ASC
  `)
  .all();

}



export function getAllLoserSurvivorRemaining() {

  return db.prepare(`
    SELECT *
    FROM loser_survivor_remaining
    ORDER BY week DESC, rank ASC
  `)
  .all();

}



export function getAvailableLoserSurvivorWeeks() {

  return db
    .prepare(`
      SELECT DISTINCT week
      FROM (
        SELECT week FROM loser_survivor

        UNION

        SELECT week FROM loser_survivor_remaining
      )

      ORDER BY week DESC
    `)
    .all()
    .map(
      (row: any) => row.week
    );

}