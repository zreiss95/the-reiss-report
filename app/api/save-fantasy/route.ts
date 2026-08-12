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
        typeof row !== "object"
      ) {
        continue;
      }



      const player =
        String(row.player ?? "")
          .trim();



      if (!player) {
        continue;
      }



      const updateData: any = {

        player,

        team:
          String(row.team ?? "")
            .toUpperCase()
            .trim(),


        position:
          String(row.position ?? "")
            .toUpperCase()
            .trim(),


        myRank:
          Number(row.myRank ?? null),


        favorite:
          Number(row.favorite ?? 0),


        tier:
          Number(row.tier ?? 3),


        analysis:
          String(row.analysis ?? ""),


        updatedAt:
          new Date().toISOString(),

      };



      if (lock) {

        updateData.locked = 1;

        updateData.lockedAt =
          new Date().toISOString();

      }



      let query =
        supabaseAdmin
          .from("fantasy_adp")
          .update(updateData)
          .eq(
            "season",
            CURRENT_SEASON
          );



      if (row.id) {

        query =
          query.eq(
            "id",
            Number(row.id)
          );

      } else {

        query =
          query.eq(
            "player",
            row.originalPlayer ?? player
          );

      }



      const { error } =
        await query;



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