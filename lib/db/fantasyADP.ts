import db from "./db";

const CURRENT_SEASON = 2026;


export function getFantasyADP(
  season = CURRENT_SEASON
) {
  return db
    .prepare(
      `
      SELECT
        fa.*,
        p.headshot
      FROM fantasy_adp fa
      LEFT JOIN players p
        ON p.name = fa.player
      WHERE fa.season = ?
      ORDER BY fa.myRank
      `
    )
    .all(season);
}



export function saveFantasyPlayer(
  data: any
) {

  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid fantasy player data"
    );
  }


  if (!data.player) {
    throw new Error(
      "Player name required"
    );
  }



  db.prepare(`
    INSERT INTO fantasy_adp (
      player,
      position,
      team,
      adp,
      adpRank,
      myRank,
      favorite,
      tier,
      analysis,
      season,
      updatedAt
    )

    VALUES (
      @player,
      @position,
      @team,
      @adp,
      @adpRank,
      @myRank,
      @favorite,
      @tier,
      @analysis,
      @season,
      datetime('now')
    )

    ON CONFLICT(player, season)

    DO UPDATE SET

      position = excluded.position,
      team = excluded.team,
      adp = excluded.adp,
      adpRank = excluded.adpRank,
      myRank = excluded.myRank,
      favorite = excluded.favorite,
      tier = excluded.tier,
      analysis = excluded.analysis,
      updatedAt = datetime('now')

  `).run({

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

    adp:
      Number(data.adp ?? 0),

    adpRank:
      Number(data.adpRank ?? 0),

    myRank:
      Number(data.myRank ?? 0),

    favorite:
      data.favorite ? 1 : 0,

    tier:
      Number(data.tier ?? 3),

    analysis:
      String(data.analysis ?? ""),

    season:
      CURRENT_SEASON,

  });

}



export function deleteFantasyPlayer(
  player: string,
  season = CURRENT_SEASON
) {

  db.prepare(`
    DELETE FROM fantasy_adp
    WHERE player = ?
    AND season = ?
  `)
  .run(
    player.trim(),
    season
  );

}