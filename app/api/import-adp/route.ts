import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const { players, season } = await req.json();


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


    const importSeason =
      Number(season) || CURRENT_SEASON;


    if (importSeason !== CURRENT_SEASON) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid season.",
        },
        {
          status: 400,
        }
      );
    }



    const insert = db.prepare(`
      INSERT INTO fantasy_adp (
        player,
        position,
        team,
        adp,
        adpRank,
        myRank,
        favorite,
        tier,
        analysis,
        season,
        updatedAt
      )

      VALUES (
        @player,
        @position,
        @team,
        @adp,
        @adpRank,
        @myRank,
        0,
        3,
        '',
        @season,
        datetime('now')
      )

      ON CONFLICT(player, season)

      DO UPDATE SET

        position = excluded.position,
        team = excluded.team,
        adp = excluded.adp,
        adpRank = excluded.adpRank,
        myRank = excluded.myRank,
        updatedAt = datetime('now')
    `);



    const transaction = db.transaction((rows: any[]) => {

      for (const row of rows) {

        const player =
          String(row.player ?? "")
            .trim();


        if (!player) {
          continue;
        }


        insert.run({

          player,

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

          season:
            importSeason,

        });

      }

    });



    transaction(players);



    return NextResponse.json({

      success: true,

      count: players.length,

      season: importSeason,

    });


  } catch (err: any) {

    console.error(
      "Import ADP error:",
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