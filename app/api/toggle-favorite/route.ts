import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(req: NextRequest) {
  try {

    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const {
      player,
      season,
    } = await req.json();



    if (!player || !season) {
      return NextResponse.json(
        {
          success: false,
          error: "Player and season are required.",
        },
        {
          status: 400,
        }
      );
    }



    const current = db
      .prepare(
        `
        SELECT favorite
        FROM fantasy_adp
        WHERE player = ?
        AND season = ?
        `
      )
      .get(player, season) as { favorite: number } | undefined;



    if (!current) {
      return NextResponse.json(
        {
          success: false,
          error: "Player not found.",
        },
        {
          status: 404,
        }
      );
    }



    const newFavorite =
      current.favorite ? 0 : 1;



    db.prepare(
      `
      UPDATE fantasy_adp
      SET 
        favorite = ?,
        updatedAt = datetime('now')
      WHERE player = ?
      AND season = ?
      `
    ).run(
      newFavorite,
      player,
      season
    );



    return NextResponse.json({

      success: true,

      favorite: newFavorite,

    });



  } catch (err: any) {

    console.error(
      "Toggle favorite error:",
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