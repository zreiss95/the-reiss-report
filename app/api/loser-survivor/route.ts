import { NextRequest, NextResponse } from "next/server";
import { saveLoserSurvivor } from "../../../lib/db/loserSurvivor";
import { requireAdmin } from "@/lib/auth/requireAdmin";


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
          error: "No picks supplied.",
        },
        {
          status: 400,
        }
      );

    }



    let saved = 0;



    for (const pick of picks) {


      if (
        !pick ||
        typeof pick !== "object"
      ) {
        continue;
      }



      saveLoserSurvivor(pick);

      saved++;

    }



    return NextResponse.json(
      {
        success: true,
        count: saved,
      }
    );



  } catch (err: any) {


    console.error(
      "Loser survivor save error:",
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