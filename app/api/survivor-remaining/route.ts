import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError =
      await requireAdmin(req);


    if (authError) {
      return authError;
    }



    const picks =
      await req.json();



    if (
      !Array.isArray(picks) ||
      picks.length === 0
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "No survivor remaining data supplied.",
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
            String(pick.team ?? "")
              .toUpperCase()
              .trim(),


          opponent:
            String(pick.opponent ?? "")
              .toUpperCase()
              .trim(),


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
          error: "No valid survivor remaining data supplied.",
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
      .from("survivor_remaining")
      .delete()
      .eq("week", week);

    if (deleteError) throw deleteError;

    // The remaining table uses a required id column without a database default.
    // Generate stable row ids in the application so inserts satisfy NOT NULL.
    // id is a bigint in these legacy tables. Use a numeric id that is
    // deterministic per week/rank instead of a string such as "2-1".
    const rowsWithIds = rows.map((row: any) => ({
      id: Number(row.week) * 10 + Number(row.rank),
      ...row,
    }));

    const { error } = await supabaseAdmin
      .from("survivor_remaining")
      .insert(rowsWithIds);

    if (error) throw error;



    return NextResponse.json({

      success: true,

      count: rows.length,

    });



  } catch (err: any) {

    console.error(
      "Save survivor remaining error:",
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