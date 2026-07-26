import TeamRankingBoard from "@/lib/components/team/TeamRankingBoard";
import { getTeamRankings } from "@/lib/db/teamRankings";

export default function TeamRankingsPage() {
  const rankings = getTeamRankings(2026);

  return (
    <main
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        padding: "40px 24px",
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

      <TeamRankingBoard rankings={rankings} />
    </main>
  );
}