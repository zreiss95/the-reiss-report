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
      .filter((row: any) => {
        return row && typeof row === "object" && row.player;
      })
      .map((row: any) => ({

        player:
          String(row.player)
            .trim(),


        position:
          String(row.position ?? "")
            .toUpperCase()
            .trim(),


        team:
          String(row.team ?? "")
            .toUpperCase()
            .trim(),


        adp:
          Number(row.adp ?? 0),


        adpRank:
          Number(row.adpRank ?? 0),


        myRank:
          Number(row.myRank ?? 0),


        favorite:
          Number(row.favorite ?? 0),


        tier:
          Number(row.tier ?? 3),


        analysis:
          String(row.analysis ?? ""),


        season:
          CURRENT_SEASON,


        updatedAt:
          new Date().toISOString(),

      }));



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
      .from("fantasy_adp")
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
      "Import fantasy error:",
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