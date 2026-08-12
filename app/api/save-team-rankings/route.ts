import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
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



    let updated = 0;



    for (const row of rankings) {


      if (
        !row ||
        typeof row !== "object" ||
        !row.team
      ) {
        continue;
      }



      const updateData: any = {

        myRank:
          Number(row.myRank ?? 0),


        favorite:
          Number(row.favorite ?? 0),


        updatedAt:
          new Date().toISOString(),

      };



      if (lock) {

        updateData.locked = 1;

        updateData.lockedAt =
          new Date().toISOString();

      }



      const {
        error,
      } = await supabaseAdmin
        .from("team_rankings")
        .update(updateData)
        .eq(
          "team",
          String(row.team)
            .toUpperCase()
            .trim()
        )
        .eq(
          "season",
          CURRENT_SEASON
        );



      if (error) {
        throw error;
      }



      updated++;

    }



    return NextResponse.json({

      success: true,

      count: updated,

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