import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {

 


  const authError =
    await requireAdmin(req);


  if (authError) {

   

    return authError;

  }



  try {

   


    const data =
      await req.json();


   



    const row = {

      gameid:
        String(data.gameId ?? "")
          .trim(),


      week:
        Number(data.week ?? 0),


      away:
        String(data.away ?? "")
          .trim(),


      home:
        String(data.home ?? "")
          .trim(),


      awaylogo:
        data.awayLogo ?? null,


      homelogo:
        data.homeLogo ?? null,


      moneylinepick:
        String(data.moneylinePick ?? "")
          .trim(),


      atspick:
        String(data.atsPick ?? "")
          .trim(),


      spread:
        Number(data.spread ?? 0),


      totalpick:
        String(data.totalPick ?? "")
          .trim(),


      totalline:
        Number(data.totalLine ?? 0),


      confidence:
        Number(data.confidence ?? 0),


      analysis:
        String(data.analysis ?? "")
          .trim(),


      kickoff:
        String(data.kickoff ?? "")
          .trim(),


      status:
        String(data.status ?? "draft")
          .trim(),


      featuredmoneyline:
        data.featuredMoneyline ? 1 : 0,


      featuredats:
        data.featuredATS ? 1 : 0,


      featuredtotal:
        data.featuredTotal ? 1 : 0,


      updatedat:
        new Date().toISOString(),

    };






    if (!row.gameid) {

      return NextResponse.json(
        {
          success:false,
          message:"Game ID is required.",
        },
        {
          status:400,
        }
      );

    }



   



    const {
      data: savedPick,
      error,
    } =
      await supabaseAdmin
        .from("picks")
        .upsert(
          row,
          {
            onConflict:"gameid",
          }
        )
        .select()
        .single();



    



    if (error) {

      console.error(
        "SUPABASE SAVE ERROR:",
        {
          message:error.message,
          details:error.details,
          hint:error.hint,
          code:error.code,
        }
      );


      return NextResponse.json(
        {
          success:false,
          message:"Supabase failed to save pick.",
          error:error.message,
          details:error.details,
          hint:error.hint,
          code:error.code,
        },
        {
          status:500,
        }
      );

    }



   



    return NextResponse.json(
      {
        success:true,
        pick:savedPick,
      }
    );



  } catch (err:any) {


    console.error(
      "SAVE PICK CATCH ERROR:",
      err
    );


    return NextResponse.json(
      {
        success:false,
        error:err.message,
      },
      {
        status:500,
      }
    );

  }

}