import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }



    const { error } = await supabase
      .from("team_rankings")
      .delete()
      .eq("season", CURRENT_SEASON);



    if (error) {
      throw error;
    }



    return NextResponse.json({
      success: true,
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