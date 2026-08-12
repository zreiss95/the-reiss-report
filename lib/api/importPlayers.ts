import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function importPlayers(data: any) {

  if (
    !data ||
    !Array.isArray(data.athletes)
  ) {
    throw new Error(
      "Invalid player data."
    );
  }



  const players =
    data.athletes
      .filter(
        (player: any) =>
          player &&
          player.id &&
          player.name
      )
      .map(
        (player: any) => ({

          playerId:
            String(player.id)
              .trim(),

          name:
            String(player.name)
              .trim(),

          team:
            String(player.team ?? "")
              .toUpperCase()
              .trim(),

          position:
            String(player.position ?? "")
              .toUpperCase()
              .trim(),

          headshot:
            player.headshot ?? null,

          active: 1,

        })
      );



  if (players.length === 0) {

    return {
      success: false,
      count: 0,
    };

  }



  const {
    error,
  } = await supabaseAdmin
    .from("players")
    .upsert(
      players,
      {
        onConflict: "playerId",
      }
    );



  if (error) {
    throw error;
  }



  return {

    success: true,

    count:
      players.length,

  };

}