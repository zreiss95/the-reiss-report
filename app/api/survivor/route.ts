import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
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



    const week = rows[0]?.week;

    // These tables do not currently have a database UNIQUE constraint on
    // (week, rank), so replace this week's rows explicitly instead of using
    // PostgREST upsert(onConflict), which causes the ON CONFLICT error.
    const { error: deleteError } = await supabaseAdmin
      .from("survivor")
      .delete()
      .eq("week", week);

    if (deleteError) throw deleteError;

    const { error } = await supabaseAdmin
      .from("survivor")
      .insert(rows);

    if (error) throw error;



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