import TeamRankingBoard from "@/lib/components/team/TeamRankingBoard";
import { getTeamRankings } from "@/lib/db/teamRankings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamRankingsPage() {
  const rankings = await getTeamRankings(2026);

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
          marginBottom: 30,
        }}
      >
        🏈 Team Rankings
      </h1>

      <TeamRankingBoard
        rankings={rankings}
        editable={false}
      />
    </main>
  );
}