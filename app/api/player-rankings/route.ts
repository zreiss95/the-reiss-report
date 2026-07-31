import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError =
      await requireAdmin(req);


    if (authError) {
      return authError;
    }



    let body;

    try {

      body = await req.json();

    } catch {

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



    const updates = rankings
      .filter(
        (row: any) =>
          row &&
          typeof row === "object" &&
          row.id
      )
      .map(
        (row: any) => {

          const myRank =
  Number(row.myRank ?? null);
        

          const consensusRank =
            Number(row.consensusRank ?? 0);



          return {

            id:
              Number(row.id),

            myRank,

            delta:
              consensusRank - myRank,

            updatedAt:
              new Date().toISOString(),

          };

        }
      );



    let updated = 0;



    for (const row of updates) {

      const {
        id,
        ...values
      } = row;



      const { error } =
        await supabase
          .from("player_rankings")
          .update(values)
          .eq("id", id);



      if (error) {
        throw error;
      }


      updated++;

    }



    return NextResponse.json(
      {
        success: true,
        count: updated,
      }
    );



  } catch (err: any) {

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