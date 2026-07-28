import { NextRequest, NextResponse } from "next/server";
import { importPlayers } from "@/lib/api/importPlayers";
import { requireAdmin } from "@/lib/auth/requireAdmin";


export async function POST(req: NextRequest) {

  try {

    const authError =
      await requireAdmin(req);


    if (authError) {
      return authError;
    }



    const data =
      await req.json();



    const result =
      await importPlayers(data);



    return NextResponse.json(
      result
    );



  } catch (err: any) {

    console.error(
      "Import players route error:",
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