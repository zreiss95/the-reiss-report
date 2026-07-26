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


    const { teams } = await req.json();


    if (!Array.isArray(teams) || teams.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No teams supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const insert = db.prepare(`
      INSERT INTO team_rankings (
        team,
        consensusRank,
        myRank,
        analysis,
        favorite,
        locked,
        season,
        updatedAt
      )

      VALUES (

        @team,
        @consensusRank,
        @myRank,
        @analysis,
        @favorite,
        @locked,
        @season,
        datetime('now')

      )


      ON CONFLICT(team, season)

      DO UPDATE SET

        consensusRank = excluded.consensusRank,
        myRank = excluded.myRank,
        analysis = excluded.analysis,
        favorite = excluded.favorite,
        locked = excluded.locked,
        updatedAt = datetime('now')

    `);



    const transaction = db.transaction((rows: any[]) => {

      for (const row of rows) {

        if (!row || typeof row !== "object") {
          continue;
        }


        if (!row.team) {
          continue;
        }



        insert.run({

          team:
            String(row.team)
              .toUpperCase()
              .trim(),


          consensusRank:
            Number(row.consensusRank ?? 0),


          myRank:
            Number(row.myRank ?? 0),


          analysis:
            String(row.analysis ?? "")
              .trim(),


          favorite:
            Number(row.favorite ?? 0),


          locked:
            Number(row.locked ?? 0),


          season:
            CURRENT_SEASON,

        });

      }

    });



    transaction(teams);



    return NextResponse.json({

      success: true,

      count: teams.length,

      season: CURRENT_SEASON,

    });



  } catch (err: any) {

    console.error(
      "Import team rankings error:",
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