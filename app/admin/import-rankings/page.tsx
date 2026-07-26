"use client";

import { useState } from "react";

export default function ImportRankingsPage() {
  const [position, setPosition] = useState("QB");
  const [text, setText] = useState("");

  async function importRankings() {
    const rows = text
      .split("\n")
      .filter((r) => r.trim() !== "");

    const rankings = rows.map((row, index) => {
      const [player, team] = row.split(",");

      return {
  player: player.trim(),
  team: (team || "").trim(),
  position,
  consensusRank: index + 1,
  myRank: index + 1,
  analysis: "",
  season: 2026,
};
    });

    const res = await fetch("/api/import-consensus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: rankings,
        position,
        season: 2026,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert("Import failed.");
      return;
    }

    alert(`Imported ${json.count} ${position} rankings.`);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 40, fontWeight: 800 }}>
        Import Consensus Rankings
      </h1>

      <div style={{ marginTop: 25 }}>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{
            padding: 12,
            fontSize: 18,
          }}
        >
          <option>QB</option>
          <option>RB</option>
          <option>WR</option>
          <option>TE</option>
          <option>DEF</option>
          <option>K</option>
        </select>
      </div>

      <textarea
        rows={24}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Josh Allen,BUF
Lamar Jackson,BAL
Joe Burrow,CIN`}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 16,
          borderRadius: 10,
        }}
      />

      <button
        onClick={importRankings}
        style={{
          marginTop: 20,
          padding: "14px 28px",
          fontSize: 18,
        }}
      >
        Import Rankings
      </button>
    </main>
  );
}