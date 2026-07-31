import TeamRankingBoard from "@/lib/components/team/TeamRankingBoard";
import { getTeamRankings } from "@/lib/db/teamRankings";
import BackButton from "@/components/BackButton";
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
      <div style={{ marginBottom: 20 }}>
        <BackButton />
      </div>

      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 30,
        }}
      >
        📊 Team Rankings
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: 30,
          fontSize: 18,
        }}
      >
        ESPN vs My Rankings
      </p>

      <TeamRankingBoard
        rankings={rankings}
        editable={false}
      />
    </main>
  );
}