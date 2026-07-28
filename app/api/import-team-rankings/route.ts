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


    const { teams } = await req.json();


    if (!Array.isArray(teams) || teams.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No teams supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const rows = teams
      .filter((row: any) => {

        return (
          row &&
          typeof row === "object" &&
          row.team
        );

      })
      .map((row: any) => ({

        team:
          String(row.team)
            .toUpperCase()
            .trim(),


        consensusRank:
          Number(row.consensusRank ?? 0),


        myRank:
          Number(row.myRank ?? 0),


        analysis:
          String(row.analysis ?? "")
            .trim(),


        favorite:
          Number(row.favorite ?? 0),


        locked:
          Number(row.locked ?? 0),


        season:
          CURRENT_SEASON,


        updatedAt:
          new Date().toISOString(),

      }));



    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid teams found.",
        },
        {
          status: 400,
        }
      );
    }



    const { error } = await supabase
      .from("team_rankings")
      .upsert(
        rows,
        {
          onConflict: "team,season",
        }
      );



    if (error) {
      throw error;
    }



    return NextResponse.json({

      success: true,

      count: rows.length,

      season: CURRENT_SEASON,

    });



  } catch (err: any) {

    console.error(
      "Import team rankings error:",
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