import db from "./db";


const CURRENT_SEASON = 2026;



function validateRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid ranking data."
    );
  }


  if (!data.player) {
    throw new Error(
      "Player name is required."
    );
  }


  return {

    player:
      String(data.player)
        .trim(),

    position:
      String(data.position ?? "")
        .toUpperCase()
        .trim(),

    team:
      String(data.team ?? "")
        .toUpperCase()
        .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    analysis:
      String(data.analysis ?? "")
        .trim(),

    season:
      Number(data.season ?? CURRENT_SEASON),

  };

}



export function getRankings(
  position: string,
  season = CURRENT_SEASON
) {

  return db
    .prepare(
      `
      SELECT
        pr.*,
        p.headshot

      FROM player_rankings pr

      LEFT JOIN players p
        ON p.name = pr.player

      WHERE pr.position = ?
      AND pr.season = ?

      ORDER BY
        CASE
          WHEN pr.consensusRank IS NULL
          OR pr.consensusRank = 0
          THEN 9999
          ELSE pr.consensusRank
        END ASC,

        pr.player ASC
      `
    )
    .all(
      String(position)
        .toUpperCase()
        .trim(),

      Number(season)
    );

}



export function saveRanking(
  data: any
) {

  const row =
    validateRankingData(data);



  db.prepare(`
    INSERT INTO player_rankings (

      player,
      position,
      team,

      consensusRank,
      myRank,

      analysis,

      season,

      updatedAt

    )

    VALUES (

      @player,
      @position,
      @team,

      @consensusRank,
      @myRank,

      @analysis,

      @season,

      datetime('now')

    )


    ON CONFLICT(player, season)

    DO UPDATE SET

      position = excluded.position,

      team = excluded.team,

      consensusRank = excluded.consensusRank,

      myRank = excluded.myRank,

      analysis = excluded.analysis,

      updatedAt = datetime('now')

  `)
  .run(row);

}



export function deleteRanking(
  player: string,
  season = CURRENT_SEASON
) {

  if (!player) {
    throw new Error(
      "Player name required."
    );
  }


  db.prepare(`
    DELETE FROM player_rankings

    WHERE player = ?

    AND season = ?

  `)
  .run(
    player.trim(),
    Number(season)
  );

}



export function getPlayers(
  position: string
) {

  return db
    .prepare(
      `
      SELECT *

      FROM players

      WHERE position = ?

      ORDER BY name ASC
      `
    )
    .all(
      String(position)
        .toUpperCase()
        .trim()
    );

}