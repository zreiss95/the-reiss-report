import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; 
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



    const { error } = await supabaseAdmin
      .from("player_rankings")
      .delete()
      .eq("position", normalizedPosition);



    if (error) {
      throw error;
    }



    return NextResponse.json({
      success: true,
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