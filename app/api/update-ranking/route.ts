import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const {
      originalPlayer,
      player,
      team,
      position,
      season = 2026,
    } = await req.json();



    if (!originalPlayer) {
      return NextResponse.json(
        {
          success: false,
          error: "Original player name is required.",
        },
        {
          status: 400,
        }
      );
    }



    if (!player) {
      return NextResponse.json(
        {
          success: false,
          error: "New player name is required.",
        },
        {
          status: 400,
        }
      );
    }



    const {
      data,
      error,
    } = await supabase
      .from("player_rankings")
      .update({

        player:
          String(player)
            .trim(),

        team:
          String(team ?? "")
            .toUpperCase()
            .trim(),

        position:
          String(position ?? "")
            .toUpperCase()
            .trim(),

        updatedAt:
          new Date().toISOString(),

      })
      .eq(
        "player",
        originalPlayer
      )
      .eq(
        "season",
        season
      )
      .select("id");



    if (error) {
      throw error;
    }



    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No ranking found to update.",
        },
        {
          status: 404,
        }
      );
    }



    return NextResponse.json({

      success: true,

      updated:
        data.length,

    });



  } catch (err: any) {

    console.error(
      "Update ranking error:",
      err
    );


    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}