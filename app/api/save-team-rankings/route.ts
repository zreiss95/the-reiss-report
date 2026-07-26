import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;


export async function POST(req: NextRequest) {

  const authenticated =
    await requireAdmin(req);


  if (!authenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }


  try {

    const {
      rankings,
      lock,
    } = await req.json();


    if (!Array.isArray(rankings)) {
      return NextResponse.json(
        {
          success: false,
          error: "No rankings supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const update = db.prepare(`

      UPDATE team_rankings

      SET

        myRank = @myRank,

        favorite = @favorite,

        updatedAt = datetime('now'),


        locked =
          CASE
            WHEN @lock = 1
            THEN 1
            ELSE locked
          END,


        lockedAt =
          CASE
            WHEN @lock = 1
            THEN datetime('now')
            ELSE lockedAt
          END


      WHERE

        team = @team

        AND season = @season

    `);



    const transaction =
      db.transaction((rows: any[]) => {


        for (const row of rows) {


          update.run({

            team:
              String(
                row.team ?? ""
              )
              .toUpperCase()
              .trim(),


            myRank:
              Number(
                row.myRank ?? 0
              ),


            favorite:
              row.favorite ?? 0,


            season:
              CURRENT_SEASON,


            lock:
              lock ? 1 : 0,

          });


        }


      });



    transaction(rankings);



    return NextResponse.json({

      success: true,

      count:
        rankings.length,

    });



  } catch (err: any) {


    console.error(
      "Save team rankings error:",
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