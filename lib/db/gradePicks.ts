import { supabase } from "@/lib/supabase";

export async function updatePickResult(
  gameId: string,
  moneylineResult: string,
  atsResult: string,
  totalResult: string,
  homeScore: number,
  awayScore: number
) {
  const { error } = await supabase
    .from("picks")
    .update({
      moneylineResult,
      atsResult,
      totalResult,
      homeScore,
      awayScore,
    })
    .eq("gameId", gameId);

  if (error) {
    console.error(
      "Update pick result error:",
      error
    );

    throw error;
  }

  return true;
}