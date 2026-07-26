import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

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



    const insert = db.prepare(`
      INSERT INTO players (
        playerId,
        name,
        team,
        position,
        headshot,
        active
      )

      VALUES (

        @playerId,
        @name,
        @team,
        @position,
        @headshot,
        1

      )


      ON CONFLICT(playerId)

      DO UPDATE SET

        name = excluded.name,
        team = excluded.team,
        position = excluded.position,
        headshot = excluded.headshot,
        active = 1

    `);



    const transaction = db.transaction((rows: any[]) => {

      for (const row of rows) {

        if (!row || typeof row !== "object") {
          continue;
        }


        if (!row.playerId || !row.name) {
          continue;
        }



        insert.run({

          playerId:
            String(row.playerId)
              .trim(),


          name:
            String(row.name)
              .trim(),


          team:
            String(row.team ?? "")
              .toUpperCase()
              .trim(),


          position:
            String(row.position ?? "")
              .toUpperCase()
              .trim(),


          headshot:
            row.headshot ?? null,

        });

      }

    });



    transaction(players);



    return NextResponse.json({

      success: true,

      count: players.length,

    });



  } catch (err: any) {

    console.error(
      "Import players error:",
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