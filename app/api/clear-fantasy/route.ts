import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }



    const result = db.prepare(`
      DELETE FROM fantasy_adp
    `).run();



    return NextResponse.json({
      success: true,
      deleted: result.changes,
    });



  } catch (err: any) {

    console.error(
      "Clear fantasy error:",
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