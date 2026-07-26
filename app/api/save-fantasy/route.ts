import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";


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

      UPDATE fantasy_adp

      SET

        player = @newPlayer,

        team = @team,

        position = @position,


        myRank = @myRank,

        favorite = @favorite,

        tier = @tier,

        analysis = @analysis,


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

        player = @oldPlayer

        AND season = @season

    `);



    const transaction =
      db.transaction((rows: any[]) => {


        for (const row of rows) {


          update.run({

            oldPlayer:
              row.originalPlayer ??
              row.player,


            newPlayer:
              String(
                row.player ?? ""
              ).trim(),


            team:
              String(
                row.team ?? ""
              )
              .toUpperCase()
              .trim(),


            position:
              String(
                row.position ?? ""
              )
              .toUpperCase()
              .trim(),


            myRank:
              Number(
                row.myRank ?? 0
              ),


            favorite:
              row.favorite ?? 0,


            tier:
              row.tier ?? 3,


            analysis:
              row.analysis ?? "",


            season:
              row.season ?? 2026,


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
      "Save fantasy error:",
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