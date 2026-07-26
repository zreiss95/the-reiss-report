import db from "./db";


export function getPicks() {

  return db
    .prepare(
      `
      SELECT *
      FROM picks
      ORDER BY week ASC, kickoff ASC
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