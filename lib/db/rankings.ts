import db from "./db";


function validateRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid ranking data."
    );
  }


  if (
    !data.week ||
    !data.position ||
    !data.rank ||
    !data.playerName
  ) {
    throw new Error(
      "Week, position, rank, and player name are required."
    );
  }


  return {

    week:
      Number(data.week),

    position:
      String(data.position)
      .toUpperCase()
      .trim(),

    rank:
      Number(data.rank),

    playerName:
      String(data.playerName)
      .trim(),

    team:
      String(data.team ?? "")
      .toUpperCase()
      .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    notes:
      String(data.notes ?? "")
      .trim(),

  };

}



export function saveRanking(
  data: any
) {

  const row =
    validateRankingData(data);



  db.prepare(`
    INSERT INTO rankings (

      week,
      position,
      rank,

      playerName,
      team,

      consensusRank,
      myRank,

      notes,

      updatedAt

    )

    VALUES (

      @week,
      @position,
      @rank,

      @playerName,
      @team,

      @consensusRank,
      @myRank,

      @notes,

      datetime('now')

    )


    ON CONFLICT(week, position, rank)

    DO UPDATE SET

      playerName = excluded.playerName,

      team = excluded.team,

      consensusRank = excluded.consensusRank,

      myRank = excluded.myRank,

      notes = excluded.notes,

      updatedAt = datetime('now')

  `)
  .run(row);

}



export function getRankings(
  week: number,
  position: string
) {

  return db
    .prepare(`
      SELECT *

      FROM rankings

      WHERE week = ?

      AND position = ?

      ORDER BY rank ASC
    `)
    .all(
      Number(week),
      String(position)
      .toUpperCase()
      .trim()
    );

}



export function getRankingPositions(
  week: number
) {

  return db
    .prepare(`
      SELECT DISTINCT position

      FROM rankings

      WHERE week = ?

      ORDER BY position ASC
    `)
    .all(
      Number(week)
    );

}



export function getAvailableRankingWeeks() {

  return db
    .prepare(`
      SELECT DISTINCT week

      FROM rankings

      ORDER BY week DESC
    `)
    .all()
    .map(
      (row: any) =>
        row.week
    );

}



export function deleteRankings(
  week: number,
  position: string
) {

  db.prepare(`
    DELETE FROM rankings

    WHERE week = ?

    AND position = ?

  `)
  .run(
    Number(week),
    String(position)
    .toUpperCase()
    .trim()
  );

}