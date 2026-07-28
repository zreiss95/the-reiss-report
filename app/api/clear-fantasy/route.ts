import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const { error } = await supabase
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