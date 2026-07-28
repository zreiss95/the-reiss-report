import { getPicks } from "@/lib/db/picks";
import { updatePickResult } from "@/lib/db/gradePicks";

type Pick = {
  gameId: string;
  moneylinePick: string;
  atsPick: string;
  spread?: number | null;
  totalPick?: string | null;
  totalLine?: number | null;
};

export async function gradeWeek(
  games: any[]
) {
  const picks = await getPicks() as Pick[];

  for (const game of games) {
    if (
      game.status?.type?.completed !== true
    ) {
      continue;
    }

    const pick = picks.find(
      (p) =>
        p.gameId === game.id
    );

    if (!pick) {
      continue;
    }

    const competition =
      game.competitions?.[0];

    if (!competition) {
      continue;
    }

    const home =
      competition.competitors?.find(
        (c: any) =>
          c.homeAway === "home"
      );

    const away =
      competition.competitors?.find(
        (c: any) =>
          c.homeAway === "away"
      );

    if (!home || !away) {
      continue;
    }

    const homeScore =
      Number(home.score ?? 0);

    const awayScore =
      Number(away.score ?? 0);


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

    let atsResult = "PUSH";

    if (
      pick.spread != null &&
      pick.atsPick
    ) {
      const spread =
        Number(pick.spread);

      if (
        pick.atsPick ===
        home.team.displayName
      ) {
        const adjusted =
          homeScore + spread;

        if (adjusted > awayScore) {
          atsResult = "WIN";
        } else if (adjusted < awayScore) {
          atsResult = "LOSS";
        }

      } else {

        const adjusted =
          awayScore + spread;

        if (adjusted > homeScore) {
          atsResult = "WIN";
        } else if (adjusted < homeScore) {
          atsResult = "LOSS";
        }
      }
    }


    //
    // TOTAL
    //

    const totalPoints =
      homeScore + awayScore;

    let totalResult = "PUSH";

    if (
      pick.totalPick &&
      pick.totalLine != null
    ) {

      const line =
        Number(pick.totalLine);

      if (
        pick.totalPick === "Over"
      ) {
        if (totalPoints > line) {
          totalResult = "WIN";
        } else if (totalPoints < line) {
          totalResult = "LOSS";
        }
      }


      if (
        pick.totalPick === "Under"
      ) {
        if (totalPoints < line) {
          totalResult = "WIN";
        } else if (totalPoints > line) {
          totalResult = "LOSS";
        }
      }
    }


    await updatePickResult(
      game.id,
      moneylineResult,
      atsResult,
      totalResult,
      homeScore,
      awayScore
    );
  }
}