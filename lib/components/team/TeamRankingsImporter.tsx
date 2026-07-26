"use client";

import { useState } from "react";

const CURRENT_SEASON = 2026;

export default function TeamRankingsImporter() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  async function importRankings() {
    const rows = text
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const teams = rows.map((row, index) => ({
      team: row,
      consensusRank: index + 1,
      myRank: index + 1,
      analysis: "",
      favorite: 0,
      locked: 0,
      season: CURRENT_SEASON,
    }));

    try {
      const res = await fetch("/api/import-team-rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teams,
          season: CURRENT_SEASON,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error || "Import failed.");
        return;
      }

      alert(`Imported ${json.count} teams.`);

      setOpen(false);
      setText("");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    }
  }

  async function clearRankings() {
    if (!confirm("Clear all team rankings?")) return;

    try {
      const res = await fetch("/api/clear-team-rankings", {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error || "Unable to clear rankings.");
        return;
      }

      alert(`Deleted ${json.deleted} team rankings.`);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Unable to clear rankings.");
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
        {open ? "Close Importer" : "Import Team Rankings"}
      </button>

      {open && (
        <div style={{ marginTop: 20 }}>
          <textarea
            rows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Buffalo Bills
Philadelphia Eagles
Baltimore Ravens
Kansas City Chiefs`}
            style={{
              width: "100%",
              padding: 16,
              background: "#111827",
              color: "white",
              border: "1px solid #334155",
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
              Import Teams
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