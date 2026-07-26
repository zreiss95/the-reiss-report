"use client";

import { useState } from "react";

export default function FantasyImporter() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  async function importADP() {
    const rows = text
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const players = rows
      .map((row, index) => {
        const [player, team, adp] = row.split(",");

        // Skip invalid rows
        if (!player || !team || !adp) return null;

        return {
          player: player.trim(),
          team: team.trim(),
          position: "ALL",

          adp: Number(adp),
          adpRank: index + 1,
          myRank: index + 1,

          favorite: 0,
          tier: 3,
          analysis: "",

          season: 2026,
        };
      })
      .filter(Boolean);

    const res = await fetch("/api/import-fantasy", {
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
      alert(json.error || "Fantasy import failed.");
      return;
    }

    alert(`Imported ${json.count} players`);

    window.location.reload();
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <button
        onClick={() => setOpen(!open)}
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
        {open ? "Close Importer" : "Import FantasyPros ADP"}
      </button>

      {open && (
        <>
          <textarea
            rows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Ja'Marr Chase,CIN,1.2
Bijan Robinson,ATL,2.3
Saquon Barkley,PHI,3.4`}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 16,
              background: "#111827",
              color: "white",
              border: "1px solid #334155",
              borderRadius: 10,
            }}
          />

          <button
            onClick={importADP}
            style={{
              marginTop: 16,
              padding: "12px 22px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Import ADP
          </button>

          <button
            onClick={async () => {
              if (!confirm("Delete all Fantasy ADP players?")) return;

              await fetch("/api/clear-fantasy", {
                method: "POST",
              });

              alert("Fantasy ADP cleared.");
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              marginLeft: 12,
              padding: "12px 22px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Clear ADP
          </button>
        </>
      )}
    </div>
  );
}