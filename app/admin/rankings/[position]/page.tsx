import RankingBoard from "../../../../lib/components/RankingBoard";
import { getRankings } from "../../../../lib/db/playerRankings";
import RankingsImporter from "../../../../lib/components/rankings/RankingsImporter";


type Props = {
  params: {
    position: string;
  };
};


type PlayerRanking = {
  id: number;
  player: string;
  position: string;
  team: string;
  consensusRank: number;
  myRank: number;
  analysis: string;
  locked: number;
  lockedAt: string | null;
};


export default function RankingsPage({
  params,
}: Props) {

  const position =
    params.position
      .toUpperCase()
      .trim();


  const rankings =
    getRankings(position) as PlayerRanking[];



  return (
    <main
      style={{
        maxWidth: 1500,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >

      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {position} Rankings
      </h1>


      <p
        style={{
          color: "#94a3b8",
          marginBottom: 30,
        }}
      >
        Compare ESPN consensus rankings to your own rankings.
      </p>



      <RankingsImporter
        position={position}
        admin={true}
      />



      {
        rankings.length > 0 &&
        rankings[0].locked === 1 &&
        (
          <div
            style={{
              marginTop: 25,
              padding: 18,
              borderRadius: 12,
              background: "#14532d",
              color: "white",
            }}
          >

            <div
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              🔒 Rankings Finalized
            </div>


            <div
              style={{
                marginTop: 6,
                color: "#d1fae5",
              }}
            >
              Finalized on {rankings[0].lockedAt}
            </div>

          </div>
        )
      }



      <div
        style={{
          height: 30,
        }}
      />



      <RankingBoard
        position={position}
        rankings={rankings}
        editable={true}
      />

    </main>
  );
}