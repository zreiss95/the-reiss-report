import db from "../../../lib/db/db";

export default function DebugPage() {
  const players = db.prepare(`
    SELECT
      name,
      team,
      headshot
    FROM players
    LIMIT 25
  `).all();

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>Players</h1>

      <pre>
        {JSON.stringify(players, null, 2)}
      </pre>
    </main>
  );
}