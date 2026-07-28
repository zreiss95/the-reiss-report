import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/requireAdmin";


function formatTeamName(name: any) {
  return String(name ?? "")
    .toLowerCase()
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


export async function POST(req: NextRequest) {

  const authError =
    await requireAdmin(req);


  if (authError) {
    return authError;
  }


  try {

    const picks =
      await req.json();



    if (
      !Array.isArray(picks) ||
      picks.length === 0
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "No survivor data supplied.",
        },
        {
          status: 400,
        }
      );

    }



    const rows = picks
      .filter(
        (pick: any) =>
          pick &&
          typeof pick === "object"
      )
      .map(
        (pick: any) => ({

          week:
            Number(pick.week ?? 0),


          rank:
            Number(pick.rank ?? 0),


          gameId:
            pick.gameId ?? null,


          team:
  formatTeamName(pick.team),


opponent:
  formatTeamName(pick.opponent),


          confidence:
            Number(pick.confidence ?? 0),


          analysis:
            String(pick.analysis ?? "")
              .trim(),


          kickoff:
            String(pick.kickoff ?? "")
              .trim(),


          status:
            String(pick.status ?? "draft")
              .trim(),


          result:
            pick.result ?? null,


          updatedAt:
            new Date().toISOString(),

        })
      );



    if (rows.length === 0) {

      return NextResponse.json(
        {
          success: false,
          error: "No valid survivor data supplied.",
        },
        {
          status: 400,
        }
      );

    }



    const {
      error,
    } = await supabase
      .from("survivor")
      .upsert(rows, {
        onConflict: "week,rank",
      });



    if (error) {
      throw error;
    }



    return NextResponse.json(
      {
        success: true,
        count: rows.length,
      }
    );



  } catch (err: any) {


    console.error(
      "Save survivor error:",
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