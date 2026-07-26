"use client";

export default function ImportPlayersPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        color: "white",
        padding: 20,
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        Import NFL Players
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginTop: 10,
        }}
      >
        Paste player list here to populate your master database.
      </p>

      <textarea
        id="players"
        rows={20}
        style={{
          width: "100%",
          marginTop: 25,
          background: "#111827",
          color: "white",
          border: "1px solid #334155",
          borderRadius: 10,
          padding: 15,
        }}
      />

      <button
  onClick={async () => {
    const textarea =
      document.getElementById("players") as HTMLTextAreaElement;

    const rows = textarea.value
      .split("\n")
      .filter((r) => r.trim() !== "");

    const players = rows.map((row) => {
      const [name, team, position] = row.split(",");

      return {
        playerId: `${name.trim()}-${position.trim()}`,
        name: name.trim(),
        team: team.trim(),
        position: position.trim(),
      };
    });

    const res = await fetch("/api/import-players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players,
      }),
    });

    const json = await res.json();

    alert(
      `Imported ${json.count} players`
    );
  }}
  style={{
    marginTop: 20,
    padding: "14px 28px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  Import Players
</button>
    </main>
  );
}