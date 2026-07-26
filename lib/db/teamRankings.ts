import db from "./db";


const CURRENT_SEASON = 2026;



function validateTeamRankingData(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid team ranking data."
    );
  }


  if (!data.team) {
    throw new Error(
      "Team is required."
    );
  }


  return {

    team:
      String(data.team)
      .toUpperCase()
      .trim(),

    consensusRank:
      Number(data.consensusRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    analysis:
      String(data.analysis ?? "")
      .trim(),

    favorite:
      data.favorite ? 1 : 0,

    locked:
      data.locked ? 1 : 0,

    lockedAt:
      data.lockedAt ?? null,

    season:
      Number(data.season ?? CURRENT_SEASON),

  };

}



export function getTeamRankings(
  season = CURRENT_SEASON
) {

  return db
    .prepare(`
      SELECT *

      FROM team_rankings

      WHERE season = ?

      ORDER BY myRank ASC

    `)
    .all(
      Number(season)
    );

}



export function saveTeamRanking(
  data: any
) {

  const row =
    validateTeamRankingData(data);



  db.prepare(`
    INSERT INTO team_rankings (

      team,

      consensusRank,

      myRank,

      analysis,

      favorite,

      locked,

      lockedAt,

      season,

      updatedAt

    )

    VALUES (

      @team,

      @consensusRank,

      @myRank,

      @analysis,

      @favorite,

      @locked,

      @lockedAt,

      @season,

      datetime('now')

    )


    ON CONFLICT(team, season)

    DO UPDATE SET

      consensusRank = excluded.consensusRank,

      myRank = excluded.myRank,

      analysis = excluded.analysis,

      favorite = excluded.favorite,

      locked = excluded.locked,

      lockedAt = excluded.lockedAt,

      updatedAt = datetime('now')

  `)
  .run(row);

}



export function deleteTeamRanking(
  team: string,
  season = CURRENT_SEASON
) {

  if (!team) {
    throw new Error(
      "Team is required."
    );
  }


  db.prepare(`
    DELETE

    FROM team_rankings

    WHERE team = ?

    AND season = ?

  `)
  .run(
    String(team)
      .toUpperCase()
      .trim(),

    Number(season)
  );

}