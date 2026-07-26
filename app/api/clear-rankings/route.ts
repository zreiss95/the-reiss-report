import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }



    const { position } = await req.json();



    if (!position) {
      return NextResponse.json(
        {
          success: false,
          error: "Position is required.",
        },
        {
          status: 400,
        }
      );
    }



    const normalizedPosition =
      String(position)
        .toUpperCase()
        .trim();



    const result = db.prepare(`
      DELETE FROM player_rankings
      WHERE position = ?
    `).run(normalizedPosition);



    return NextResponse.json({
      success: true,
      deleted: result.changes,
      position: normalizedPosition,
    });



  } catch (err: any) {

    console.error(
      "Clear rankings error:",
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