"use client";

import { useState } from "react";

type Props = {
  position: string;
  admin?: boolean;
};

export default function RankingsImporter({
  position,
  admin = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  if (!admin) {
    return null;
  }

  async function importRankings() {
    const rows = text
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const players = rows.map((row, index) => {
      const [player, team] = row
        .split(",")
        .map((v) => v.trim());

      return {
        // Permanent identity key
        playerId: `${position}-${index + 1}`,

        // Editable display name
        player,

        // Editable team abbreviation
        team: team ?? "",

        position,

        consensusRank: index + 1,
        myRank: index + 1,

        analysis: "",
      };
    });

    try {
      const res = await fetch("/api/import-consensus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          players,
          season: 2026,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error || "Import failed.");
        return;
      }

      alert(
        `Imported ${json.count} ${position} rankings.`
      );

      setOpen(false);
      setText("");

      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Import failed.");
    }
  }


  async function clearRankings() {
    if (!confirm(`Clear all ${position} rankings?`)) {
      return;
    }

    try {
      const res = await fetch("/api/clear-rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error || "Clear failed.");
        return;
      }

      alert(`${position} rankings cleared.`);

      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Clear failed.");
    }
  }


  return (
    <div style={{ marginBottom: 30 }}>

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "12px 22px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {open
          ? "Close Importer"
          : "Import ESPN Rankings"}
      </button>


      {open && (
        <div style={{ marginTop: 20 }}>

          <textarea
            rows={20}
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder={`Josh Allen,BUF
Joe Burrow,CIN
Lamar Jackson,BAL`}
            style={{
              width: "100%",
              padding: 16,
              background: "#111827",
              color: "white",
              border:
                "1px solid #334155",
              borderRadius: 10,
              resize: "vertical",
            }}
          />


          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
            }}
          >

            <button
              onClick={importRankings}
              style={{
                padding: "12px 22px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Import Rankings
            </button>


            <button
              onClick={clearRankings}
              style={{
                padding: "12px 22px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Clear Rankings
            </button>

          </div>

        </div>
      )}

    </div>
  );
}