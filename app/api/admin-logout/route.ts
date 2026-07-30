import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST() {

  try {

    const supabase =
      await createClient();


    await supabase.auth.signOut();


    return NextResponse.json(
      {
        success:true,
        message:"Logged out.",
      },
      {
        status:200,
      }
    );


  } catch (err) {

    console.error(
      "Logout error:",
      err
    );


    return NextResponse.json(
      {
        success:false,
        error:"Logout failed.",
      },
      {
        status:500,
      }
    );

  }

}