import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    let body;

    try {
      body = await req.json();
    }
    catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }


    const {
      rankings,
    } = body;


    if (
      !Array.isArray(rankings) ||
      rankings.length === 0
    ) {
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

        myRank = ?,

        delta = ?,

        updatedAt = datetime('now')

      WHERE id = ?

    `);



    const transaction = db.transaction(
      (rows: any[]) => {

        for (const row of rows) {

          if (
            !row ||
            typeof row !== "object"
          ) {
            continue;
          }


          if (!row.id) {
            continue;
          }



          const myRank =
            Number(row.myRank ?? 0);


          const consensusRank =
            Number(row.consensusRank ?? 0);



          update.run(

            myRank,

            consensusRank - myRank,

            Number(row.id)

          );

        }

      }
    );



    transaction(rankings);



    return NextResponse.json(
      {
        success: true,
        count: rankings.length,
      }
    );



  }
  catch (err: any) {

    console.error(
      "Update ranking error:",
      err
    );


    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Failed to update rankings.",
      },
      {
        status: 500,
      }
    );

  }

}