import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const { players } = await req.json();


    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No players supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const rows = players
      .map((row: any, index: number) => {

        if (!row || typeof row !== "object") {
          return null;
        }


        const position =
          String(row.position ?? "")
            .toUpperCase()
            .trim();


        const player =
          String(row.player ?? "")
            .trim();


        if (!player) {
          return null;
        }


        return {

          playerId:
            row.playerId ??
            `${CURRENT_SEASON}-${position}-${index + 1}`,


          player,


          position,


          team:
            String(row.team ?? "")
              .toUpperCase()
              .trim(),


          consensusRank:
            Number(
              row.consensusRank ?? index + 1
            ),


          myRank:
            Number(
              row.myRank ?? index + 1
            ),


          analysis:
            String(
              row.analysis ?? ""
            ),


          season:
            CURRENT_SEASON,


          updatedAt:
            new Date().toISOString(),

        };

      })
      .filter(Boolean);



    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid players found.",
        },
        {
          status: 400,
        }
      );
    }



    const { error } = await supabaseAdmin
      .from("player_rankings")
      .upsert(
        rows,
        {
          onConflict: "player,season",
        }
      );



    if (error) {
      throw error;
    }



    return NextResponse.json({

      success: true,

      count: rows.length,

      season: CURRENT_SEASON,

    });



  } catch (err: any) {

    console.error(
      "Import consensus error:",
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