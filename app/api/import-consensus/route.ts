import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const CURRENT_SEASON = 2026;

interface ExistingPlayer {
  id: number;
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);

    if (authError) {
      return authError;
    }


    const { players } = await req.json();


    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No players supplied.",
        },
        {
          status: 400,
        }
      );
    }



    const findExisting = db.prepare(`
      SELECT id
      FROM player_rankings
      WHERE player = @player
      AND season = @season
    `);



    const updateExisting = db.prepare(`
      UPDATE player_rankings

      SET

        player = @player,
        position = @position,
        team = @team,
        consensusRank = @consensusRank,
        myRank = @myRank,
        analysis = @analysis,
        updatedAt = datetime('now')

      WHERE

        id = @id

    `);



    const insertNew = db.prepare(`
      INSERT INTO player_rankings (

        playerId,
        player,
        position,
        team,
        consensusRank,
        myRank,
        analysis,
        season,
        updatedAt

      )

      VALUES (

        @playerId,
        @player,
        @position,
        @team,
        @consensusRank,
        @myRank,
        @analysis,
        @season,
        datetime('now')

      )
    `);



    const transaction = db.transaction(
      (rows: any[]) => {

        rows.forEach((row, index) => {

          if (!row || typeof row !== "object") {
            return;
          }



          const position =
            String(row.position ?? "")
              .toUpperCase()
              .trim();



          const player =
            String(row.player ?? "")
              .trim();



          if (!player) {
            return;
          }



          const data = {

            playerId:
              row.playerId ??
              `${CURRENT_SEASON}-${position}-${index + 1}`,


            player,


            position,


            team:
              String(row.team ?? "")
                .toUpperCase()
                .trim(),


            consensusRank:
              Number(
                row.consensusRank ?? index + 1
              ),


            myRank:
              Number(
                row.myRank ?? index + 1
              ),


            analysis:
              String(
                row.analysis ?? ""
              ),


            season:
              CURRENT_SEASON,

          };



          const existing =
            findExisting.get({
              player: data.player,
              season: CURRENT_SEASON,
            }) as ExistingPlayer | undefined;



          if (existing) {

            updateExisting.run({
              id: existing.id,
              ...data,
            });


          } else {

            insertNew.run(data);

          }

        });

      }
    );



    transaction(players);



    return NextResponse.json({

      success: true,

      count: players.length,

      season: CURRENT_SEASON,

    });



  } catch (err: any) {

    console.error("Import consensus error:", err);


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