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


    const picks =
      await req.json();


    if (!Array.isArray(picks) || picks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No picks supplied.",
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
          error: "No valid picks supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const { error } = await supabase
      .from("loser_survivor_remaining")
      .upsert(rows, {
        onConflict: "week,rank",
      });



    if (error) {
      throw error;
    }



    return NextResponse.json({

      success: true,

      count: rows.length,

    });



  } catch (err: any) {

    console.error(
      "Loser survivor remaining save error:",
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