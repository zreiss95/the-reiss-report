import FantasyImporter from "../../../lib/components/fantasy/FantasyImporter";
import FantasyRankingBoard from "../../../lib/components/fantasy/FantasyRankingBoard";
import { getFantasyADP } from "../../../lib/db/fantasyADP";

export default function FantasyPage() {
  const rankings = getFantasyADP();

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

      <FantasyImporter />

      <div style={{ height: 30 }} />

      <FantasyRankingBoard
  rankings={rankings}
  editable={true}
/>
    </main>
  );
}