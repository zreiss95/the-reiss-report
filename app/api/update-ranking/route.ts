import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
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



    const result = db.prepare(`

      UPDATE player_rankings

      SET

        player = @player,

        team = @team,

        position = @position,

        updatedAt = datetime('now')


      WHERE

        player = @originalPlayer

        AND season = @season

    `)
    .run({

      originalPlayer,

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

      season,

    });



    if (result.changes === 0) {
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
        result.changes,

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