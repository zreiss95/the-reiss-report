import { supabase } from "@/lib/supabase";

export async function getFantasyADP(
  season: number = 2026
) {
  const {
    data,
    error,
  } = await supabase
    .from("fantasy_adp")
    .select("*")
    .eq("season", season)
    .order("myRank", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}


export async function getFantasyPlayer(
  player: string,
  season: number = 2026
) {
  const {
    data,
    error,
  } = await supabase
    .from("fantasy_adp")
    .select("*")
    .eq("player", player)
    .eq("season", season)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw error;
  }

  return data;
}


export async function saveFantasyADP(
  data: any
) {
  const {
    error,
  } = await supabase
    .from("fantasy_adp")
    .upsert(
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      {
        onConflict: "player,season",
      }
    );

  if (error) {
    throw error;
  }

  return true;
}


export async function deleteFantasyADP(
  season: number = 2026
) {
  const {
    error,
  } = await supabase
    .from("fantasy_adp")
    .delete()
    .eq("season", season);

  if (error) {
    throw error;
  }

  return true;
}