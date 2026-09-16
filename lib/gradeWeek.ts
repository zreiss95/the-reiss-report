import { getPicks } from "@/lib/db/picks";
import { updatePickResult } from "@/lib/db/gradePicks";

type Pick = {
  gameid: string;
  moneylinepick: string;
  atspick: string;
  spread?: number | null;
  totalpick?: string | null;
  totalline?: number | null;
};

export async function gradeWeek(games: any[]) {
  const picks = (await getPicks()) as Pick[];

  for (const game of games) {
    if (game.status?.type?.completed !== true) continue;

    const pick = picks.find((p) => String(p.gameid) === String(game.id));
    if (!pick) continue;

    const competition = game.competitions?.[0];
    if (!competition) continue;

    const home = competition.competitors?.find((c: any) => c.homeAway === "home");
    const away = competition.competitors?.find((c: any) => c.homeAway === "away");
    if (!home || !away) continue;

    const homeScore = Number(home.score ?? 0);
    const awayScore = Number(away.score ?? 0);

    // MONEYLINE
    let moneylineResult = "PUSH";
    if (homeScore !== awayScore && pick.moneylinepick) {
      const winner = homeScore > awayScore
        ? home.team.displayName
        : away.team.displayName;
      moneylineResult = winner === pick.moneylinepick ? "WIN" : "LOSS";
    }

    // ATS
    let atsResult = "PUSH";
    if (pick.spread != null && pick.atspick) {
      const spread = Number(pick.spread);
      const pickedHome = pick.atspick === home.team.displayName;
      const pickedAway = pick.atspick === away.team.displayName;

      if (pickedHome) {
        const adjusted = homeScore + spread;
        if (adjusted > awayScore) atsResult = "WIN";
        else if (adjusted < awayScore) atsResult = "LOSS";
      } else if (pickedAway) {
        const adjusted = awayScore + spread;
        if (adjusted > homeScore) atsResult = "WIN";
        else if (adjusted < homeScore) atsResult = "LOSS";
      }
    }

    // TOTAL
    const totalPoints = homeScore + awayScore;
    let totalResult = "PUSH";

    if (pick.totalpick && pick.totalline != null) {
      const line = Number(pick.totalline);
      const totalPick = pick.totalpick.toLowerCase();

      if (totalPick === "over") {
        if (totalPoints > line) totalResult = "WIN";
        else if (totalPoints < line) totalResult = "LOSS";
      } else if (totalPick === "under") {
        if (totalPoints < line) totalResult = "WIN";
        else if (totalPoints > line) totalResult = "LOSS";
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
