import { NextRequest, NextResponse } from "next/server";
import { savePick } from "../../../lib/db/picks";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {

  const authenticated =
    await requireAdmin(req);


  if (!authenticated) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }


  try {

    const data =
      await req.json();



    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pick data.",
        },
        {
          status: 400,
        }
      );
    }



    data.featuredMoneyline =
      data.featuredMoneyline ? 1 : 0;


    data.featuredATS =
      data.featuredATS ? 1 : 0;


    data.featuredTotal =
      data.featuredTotal ? 1 : 0;



    savePick(data);



    return NextResponse.json({
      success: true,
    });



  } catch (err: any) {


    console.error(
      "Save pick error:",
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