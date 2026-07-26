import { NextRequest, NextResponse } from "next/server";
import { saveSurvivorRemaining } from "../../../lib/db/survivor";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {
  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const picks = await req.json();


    if (!Array.isArray(picks) || picks.length === 0) {
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



    let saved = 0;



    for (const pick of picks) {

      if (!pick || typeof pick !== "object") {
        continue;
      }


      saveSurvivorRemaining(pick);

      saved++;

    }



    return NextResponse.json({

      success: true,

      count: saved,

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