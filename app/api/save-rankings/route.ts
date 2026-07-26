import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;


export async function POST(req: NextRequest) {

  const authError =
    await requireAdmin(req);


  if (authError) {
    return authError;
  }


  try {

    const {
      rankings,
      lock,
      position,
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

      UPDATE player_rankings

      SET

        player = @player,

        team = @team,

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

        id = @id

        AND season = @season

    `);



    const updateFallback = db.prepare(`

      UPDATE player_rankings

      SET

        player = @player,

        team = @team,

        myRank = @myRank,

        favorite = @favorite,

        updatedAt = datetime('now')

      WHERE

        player = @originalPlayer

        AND position = @position

        AND season = @season

    `);



    const transaction =
      db.transaction((rows: any[]) => {


        for (const row of rows) {


          const data = {

            id:
              row.id ?? null,


            player:
              String(
                row.player ?? ""
              ).trim(),


            team:
              String(
                row.team ?? ""
              )
              .trim()
              .toUpperCase(),


            myRank:
              Number(
                row.myRank ?? 0
              ),


            favorite:
              Number(
                row.favorite ?? 0
              ),


            lock:
              lock ? 1 : 0,


            season:
              CURRENT_SEASON,


            originalPlayer:
              row.originalPlayer ??
              row.player,


            position:
              String(
                position ?? row.position ?? ""
              )
              .toUpperCase()
              .trim(),

          };



          let result;



          if (data.id) {

            result =
              update.run(data);

          } else {

            result =
              updateFallback.run(data);

          }



          if (result.changes === 0) {

            console.warn(
              "No ranking updated for:",
              data.player
            );

          }


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
      "Save rankings error:",
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