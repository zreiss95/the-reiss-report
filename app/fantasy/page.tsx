import FantasyRankingBoard from "@/lib/components/fantasy/FantasyRankingBoard";
import { getFantasyADP } from "@/lib/db/fantasyADP";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FantasyPage() {
  const rankings = await getFantasyADP();

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
          marginBottom: 10,
        }}
      >
        Fantasy ADP Rankings
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: 30,
        }}
      >
        Compare FantasyPros ADP against my draft board.
      </p>

      <FantasyRankingBoard
        rankings={rankings}
      />
    </main>
  );
}