"use client";

import { useState } from "react";

export default function LoserSurvivorAdmin({
  games,
  saved = [],
}: {
  games: any[];
  saved?: any[];
}) {
  const [slots, setSlots] = useState(() => {
  const defaults = [
    {
      rank: 1,
      gameId: "",
      home: "",
      away: "",
      team: "",
      opponent: "",
      confidence: 95,
      analysis: "",
      kickoff: "",
      status: "Draft",
    },
    {
      rank: 2,
      gameId: "",
      home: "",
      away: "",
      team: "",
      opponent: "",
      confidence: 90,
      analysis: "",
      kickoff: "",
      status: "Draft",
    },
    {
      rank: 3,
      gameId: "",
      home: "",
      away: "",
      team: "",
      opponent: "",
      confidence: 85,
      analysis: "",
      kickoff: "",
      status: "Draft",
    },
  ];

  return defaults.map((slot) => {
    const existing = saved.find(
      (p: any) => p.rank === slot.rank
    );

    return existing
      ? {
          ...slot,
          ...existing,
        }
      : slot;
  });
});

  const [loading, setLoading] = useState(false);
async function savePicks() {
  setLoading(true);

  try {
    const week =
      games[0]?.week?.number ?? 1;

    const payload = slots.map((slot) => ({
      ...slot,
      week,
    }));

    const res = await fetch("/api/loser-survivor", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  throw new Error(await res.text());
}

    alert("Loser Survivor picks saved!");

    window.location.reload();
  } finally {
    setLoading(false);
  }
}
const getTitle = (rank: number) => {
  if (rank === 1) {
    return {
      text: "💀 Best Fade",
      color: "#ef4444",
    };
  }

  if (rank === 2) {
    return {
      text: "☠️ 2nd Best Fade",
      color: "#f97316",
    };
  }

  return {
    text: "⚠️ Backup Fade",
    color: "#eab308",
  };
};

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      {slots.map((slot) => (
        <div
          key={slot.rank}
          style={{
            background: "#172036",
            border: "1px solid #24314f",
            borderRadius: 18,
            padding: 24,
          }}
        >
          <h2
            style={{
              color: getTitle(slot.rank).color,
              marginBottom: 20,
            }}
          >
            {getTitle(slot.rank).text}
          </h2>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <select
  value={slot.gameId}
  onChange={(e) => {
    const game = games.find(
      (g: any) => g.id === e.target.value
    );

    if (!game) return;

    const comp = game.competitions[0];

    const away = comp.competitors.find(
      (c: any) => c.homeAway === "away"
    );

    const home = comp.competitors.find(
      (c: any) => c.homeAway === "home"
    );

    setSlots((prev) =>
      prev.map((s) =>
        s.rank === slot.rank
          ? {
              ...s,
              gameId: game.id,
              away: away.team.displayName,
              home: home.team.displayName,
              kickoff: comp.date,
              team: "",
              opponent: "",
            }
          : s
      )
    );
  }}
  style={{
    padding: 12,
    borderRadius: 10,
    background: "#111827",
    color: "white",
    border: "1px solid #334155",
  }}
>
              <option value="">Select Game</option>

              {games.map((game: any) => {
                const comp = game.competitions[0];

                const away = comp.competitors.find(
                  (c: any) => c.homeAway === "away"
                );

                const home = comp.competitors.find(
                  (c: any) => c.homeAway === "home"
                );

                return (
                  <option
  key={game.id}
  value={game.id}
>
                    {away.team.displayName} @ {home.team.displayName}
                  </option>
                );
              })}
            </select>

{slot.gameId && (
  <select
    value={slot.team}
    onChange={(e) => {
      const selected = e.target.value;

      setSlots((prev) =>
        prev.map((s) => {
          if (s.rank !== slot.rank) return s;

          return {
            ...s,
            team: selected,
            opponent:
              selected === s.home
                ? s.away
                : s.home,
          };
        })
      );
    }}
    style={{
      padding: 12,
      borderRadius: 10,
      background: "#111827",
      color: "white",
      border: "1px solid #334155",
    }}
  >
    <option value="">Choose Team To Lose</option>

    <option value={slot.home}>
      {slot.home}
    </option>

    <option value={slot.away}>
      {slot.away}
    </option>
  </select>
)}

<div
  style={{
    display: "grid",
    gap: 10,
  }}
>
  <input
    type="range"
    min={50}
    max={100}
    step={1}
    value={slot.confidence}
    onChange={(e) =>
      setSlots((prev) =>
        prev.map((s) =>
          s.rank === slot.rank
            ? {
                ...s,
                confidence: Number(e.target.value),
              }
            : s
        )
      )
    }
    style={{
      width: "100%",
      accentColor:
        slot.confidence >= 90
          ? "#22c55e"
          : slot.confidence >= 80
          ? "#eab308"
          : "#ef4444",
      cursor: "pointer",
    }}
  />

  <div
    style={{
      textAlign: "center",
      fontSize: 20,
      fontWeight: 700,
      color:
        slot.confidence >= 90
          ? "#22c55e"
          : slot.confidence >= 80
          ? "#eab308"
          : "#ef4444",
    }}
  >
    {slot.confidence}% Confidence
  </div>
</div>

            <textarea
  rows={4}
  placeholder="Analysis..."
  value={slot.analysis}
  onChange={(e) =>
    setSlots((prev) =>
      prev.map((s) =>
        s.rank === slot.rank
          ? {
              ...s,
              analysis: e.target.value,
            }
          : s
      )
    )
  }
  style={{
    padding: 12,
    borderRadius: 10,
    background: "#111827",
    color: "white",
    border: "1px solid #334155",
    resize: "vertical",
  }}
/>
          </div>
        </div>
            ))}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <button
          onClick={savePicks}
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "14px 34px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {loading ? "Saving..." : "Save Loser Survivor Picks"}
        </button>
      </div>
    </div>
  );
}