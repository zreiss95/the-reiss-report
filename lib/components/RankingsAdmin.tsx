"use client";

import { useState } from "react";

const CURRENT_SEASON = 2026;

export default function RankingsAdmin({
  position,
  rankings,
}: {
  position: string;
  rankings: any[];
}) {
  const normalizedPosition = position.toUpperCase();

  const [importText, setImportText] = useState("");

  const [players, setPlayers] = useState(
    rankings.length
      ? rankings.map((p) => ({
          ...p,
          position: normalizedPosition,
          season: CURRENT_SEASON,
        }))
      : [
          {
            player: "",
            position: normalizedPosition,
            team: "",
            consensusRank: 1,
            myRank: 1,
            analysis: "",
            season: CURRENT_SEASON,
          },
        ]
  );

  async function save() {
    for (const player of players) {
      await fetch("/api/player-rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...player,
          position: normalizedPosition,
          season: CURRENT_SEASON,
        }),
      });
    }

    alert("Rankings saved!");
  }

  async function importPlayers() {
    const rows = importText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const imported = rows.map((row, index) => {
      const [player, team] = row.split(",");

      return {
        player: player?.trim() || "",
        team: team?.trim() || "",
        position: normalizedPosition,
        consensusRank: index + 1,
        myRank: index + 1,
        analysis: "",
        season: CURRENT_SEASON,
      };
    });

    const res = await fetch("/api/import-consensus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: imported,
        position: normalizedPosition,
        season: CURRENT_SEASON,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(json.error || "Import failed.");
      return;
    }

    setPlayers(imported);

    alert(`Imported ${json.count} rankings.`);

    window.location.reload();
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <div
        style={{
          background: "#172036",
          border: "1px solid #24314f",
          borderRadius: 18,
          padding: 24,
        }}
      >
        <h2
          style={{
            marginBottom: 15,
            fontSize: 22,
          }}
        >
          Import Consensus Rankings
        </h2>

        <textarea
          rows={10}
          placeholder={`Patrick Mahomes,KC
Josh Allen,BUF
Lamar Jackson,BAL`}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            background: "#111827",
            color: "white",
            border: "1px solid #334155",
            resize: "vertical",
          }}
        />

        <button
          onClick={importPlayers}
          style={{
            marginTop: 16,
            padding: "12px 24px",
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
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#172036",
          border: "1px solid #24314f",
          borderRadius: 18,
          padding: 20,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "white",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 12 }}>Consensus</th>
              <th style={{ padding: 12 }}>My Rank</th>
              <th style={{ padding: 12 }}>Δ</th>
              <th style={{ padding: 12 }}>Player</th>
              <th style={{ padding: 12 }}>Team</th>
              <th style={{ padding: 12 }}>Analysis</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => {
              const diff =
                player.consensusRank - player.myRank;

              return (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      "1px solid #24314f",
                  }}
                >
                  <td style={{ padding: 10, textAlign: "center" }}>
                    {player.consensusRank}
                  </td>

                  <td style={{ padding: 10 }}>
                    <input
                      type="number"
                      value={player.myRank}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].myRank =
                          Number(e.target.value);
                        setPlayers(copy);
                      }}
                      style={{
                        width: 70,
                        padding: 6,
                        background: "#111827",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: 6,
                      }}
                    />
                  </td>

                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 800,
                    }}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>

                  <td style={{ padding: 10 }}>
                    <input
                      value={player.player}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].player =
                          e.target.value;
                        setPlayers(copy);
                      }}
                      style={{
                        width: "100%",
                        padding: 6,
                        background: "#111827",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: 6,
                      }}
                    />
                  </td>

                  <td style={{ padding: 10 }}>
                    <input
                      value={player.team}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].team =
                          e.target.value;
                        setPlayers(copy);
                      }}
                      style={{
                        width: 70,
                        padding: 6,
                        background: "#111827",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: 6,
                      }}
                    />
                  </td>

                  <td style={{ padding: 10 }}>
                    <input
                      value={player.analysis || ""}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].analysis =
                          e.target.value;
                        setPlayers(copy);
                      }}
                      style={{
                        width: "100%",
                        padding: 6,
                        background: "#111827",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: 6,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <button
          onClick={() =>
            setPlayers([
              ...players,
              {
                player: "",
                position: normalizedPosition,
                team: "",
                consensusRank: players.length + 1,
                myRank: players.length + 1,
                analysis: "",
                season: CURRENT_SEASON,
              },
            ])
          }
          style={{
            padding: "12px 20px",
            background: "#334155",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + Add Player
        </button>

        <button
          onClick={save}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Save Rankings
        </button>
      </div>
    </div>
  );
}