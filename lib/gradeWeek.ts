import { getPicks } from "./db/picks";
import { updatePickResult } from "./db/gradePicks";

type Pick = {
  gameId: string;
  moneylinePick: string;
 atsPick: string;
  spread: number;

  totalPick?: string;
  totalLine?: number;
};

export async function gradeWeek(games: any[]) {
  const picks = getPicks() as Pick[];

  for (const game of games) {
    if (game.status?.type?.completed !== true) continue;

    const pick = picks.find(
      (p) => p.gameId === game.id
    );

    if (!pick) continue;

    const competition = game.competitions[0];

    const home = competition.competitors.find(
      (c: any) => c.homeAway === "home"
    );

    const away = competition.competitors.find(
      (c: any) => c.homeAway === "away"
    );

    const homeScore = Number(home.score);
    const awayScore = Number(away.score);

    //
    // MONEYLINE
    //

    const winner =
      homeScore > awayScore
        ? home.team.displayName
        : away.team.displayName;

    const moneylineResult =
      winner === pick.moneylinePick
        ? "WIN"
        : "LOSS";

    //
    // ATS
    //

    const spread = Number(pick.spread);

    let atsResult = "PUSH";

    if (pick.atsPick === home.team.displayName) {
      const adjusted = homeScore + spread;

      if (adjusted > awayScore) {
        atsResult = "WIN";
      } else if (adjusted < awayScore) {
        atsResult = "LOSS";
      }
    } else {
      const adjusted = awayScore - spread;

      if (adjusted > homeScore) {
        atsResult = "WIN";
      } else if (adjusted < homeScore) {
        atsResult = "LOSS";
      }
    }

//
// TOTAL
//

const totalPoints = homeScore + awayScore;

let totalResult = "PUSH";

if (
  pick.totalPick &&
  pick.totalLine != null
) {
  if (pick.totalPick === "Over") {
    if (totalPoints > pick.totalLine) {
      totalResult = "WIN";
    } else if (totalPoints < pick.totalLine) {
      totalResult = "LOSS";
    }
  }

  if (pick.totalPick === "Under") {
    if (totalPoints < pick.totalLine) {
      totalResult = "WIN";
    } else if (totalPoints > pick.totalLine) {
      totalResult = "LOSS";
    }
  }
}

updatePickResult(
  game.id,
  moneylineResult,
  atsResult,
  totalResult,
  homeScore,
  awayScore
);
  }
}