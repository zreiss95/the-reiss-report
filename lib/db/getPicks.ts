import { supabase } from "@/lib/supabase";


export async function getPicks() {

  const { data, error } = await supabase
    .from("picks")
    .select("*")
    .order("week", { ascending: true })
    .order("kickoff", { ascending: true });


  if (error) {
    console.error(
      "Get picks error:",
      error
    );

    return [];
  }


  return data ?? [];

}



export async function getPick(
  gameId: string
) {

  if (!gameId) {
    return null;
  }


  const { data, error } = await supabase
    .from("picks")
    .select("*")
    .eq(
      "gameid",
      gameId.trim()
    )
    .limit(1)
    .maybeSingle();


  if (error) {
    console.error(
      "Get pick error:",
      error
    );

    return null;
  }


  return data;

}