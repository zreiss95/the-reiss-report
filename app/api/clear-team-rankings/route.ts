import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;

export async function POST(req: NextRequest) {
  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const result = db.prepare(`
      DELETE FROM team_rankings
      WHERE season = ?
    `).run(CURRENT_SEASON);



    return NextResponse.json({
      success: true,
      deleted: result.changes,
    });



  } catch (err: any) {

    console.error(
      "Clear team rankings error:",
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