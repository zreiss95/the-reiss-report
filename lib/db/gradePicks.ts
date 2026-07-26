import db from "./db";


export function updatePickResult(
  gameId: string,
  moneylineResult: string,
  atsResult: string,
  totalResult: string,
  homeScore: number,
  awayScore: number
) {

  if (!gameId) {
    throw new Error(
      "Game ID is required."
    );
  }


  const cleanScore = (
    value: number
  ) => {

    const score =
      Number(value);

    return Number.isFinite(score)
      ? score
      : 0;

  };



  const result =
    db.prepare(`
      UPDATE picks

      SET

        moneylineResult = ?,
        atsResult = ?,
        totalResult = ?,

        homeScore = ?,
        awayScore = ?,

        gradedAt = datetime('now'),
        updatedAt = datetime('now')

      WHERE gameId = ?

    `)
    .run(

      String(moneylineResult ?? "")
        .trim(),

      String(atsResult ?? "")
        .trim(),

      String(totalResult ?? "")
        .trim(),

      cleanScore(homeScore),

      cleanScore(awayScore),

      gameId.trim()

    );



  if (result.changes === 0) {
    throw new Error(
      "Pick not found."
    );
  }


  return result.changes;

}