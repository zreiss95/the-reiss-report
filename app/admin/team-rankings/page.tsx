import TeamRankingBoard from "@/lib/components/team/TeamRankingBoard";
import TeamRankingsImporter from "@/lib/components/team/TeamRankingsImporter";
import { getTeamRankings } from "@/lib/db/teamRankings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamRankingsPage() {

  const rankings =
    await getTeamRankings();


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
        NFL Team Rankings
      </h1>


      <p
        style={{
          color: "#94a3b8",
          marginBottom: 30,
        }}
      >
        Rank all 32 NFL teams before the season.
      </p>


      <TeamRankingsImporter />


      <div style={{ height: 30 }} />


      <TeamRankingBoard
        rankings={rankings}
        editable={true}
      />

    </main>
  );
}