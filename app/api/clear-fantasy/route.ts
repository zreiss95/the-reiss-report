import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const { error } = await supabaseAdmin
      .from("fantasy_adp")
      .delete()
      .neq("id", 0);


    if (error) {
      throw error;
    }


    return NextResponse.json({
      success: true,
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