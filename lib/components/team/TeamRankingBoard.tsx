"use client";

import { useEffect, useMemo, useState } from "react";
import SortableTeam from "./SortableTeam";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function RankingBoard({
  rankings,
editable = false,
}: {
  rankings: any[];
  editable?: boolean;
}) {
  // Immutable copy for consensus column
  const consensusRankings = useMemo(
    () =>
      [...rankings].sort(
        (a, b) => a.consensusRank - b.consensusRank
      ),
    [rankings]
  );

  // Independent copy for your rankings
  const [myRankings, setMyRankings] = useState(
    rankings.map((p) => ({ ...p }))
  );

  const [search, setSearch] = useState("");

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) =>
      row.startsWith("admin-csrf-token=")
    )
    ?.split("=")[1];
}

  useEffect(() => {
    setMyRankings(rankings.map((p) => ({ ...p })));
  }, [rankings]);

  const locked =
  !editable ||
  (myRankings.length > 0 && myRankings[0].locked === 1);

const filteredConsensus = consensusRankings.filter((team) => {
  const q = search.toLowerCase();

  return team.team.toLowerCase().includes(q);
});

const filteredMyRankings = myRankings.filter((team) => {
  const q = search.toLowerCase();

  return team.team.toLowerCase().includes(q);
});

  function handleDragEnd(event: any) {
    if (locked) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = myRankings.findIndex(
      (p) => p.team === active.id
    );

    const newIndex = myRankings.findIndex(
      (p) => p.team === over.id
    );

    const reordered = arrayMove(
      [...myRankings],
      oldIndex,
      newIndex
    ).map((team, index) => ({
      ...team,
      myRank: index + 1,
    }));

    setMyRankings(reordered);

    const csrf = getCsrfToken();

fetch("/api/save-team-rankings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",

    ...(csrf
      ? {
          "x-csrf-token": csrf,
        }
      : {}),
  },
      body: JSON.stringify({
        rankings: reordered,
        lock: false,
      }),
    });
  }

  async function saveRankings() {

  const csrf = getCsrfToken();

  const res = await fetch("/api/save-team-rankings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      ...(csrf
        ? {
            "x-csrf-token": csrf,
          }
        : {}),
    },
      body: JSON.stringify({
        rankings: myRankings,
        lock: false,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(json.error);
      return;
    }

    alert("Team rankings saved!");
  }

  async function finalizeRankings() {
    if (
      !confirm(
        "Finalize team rankings? They will become read-only."
      )
    ) {
      return;
    }

    const csrf = getCsrfToken();

const res = await fetch("/api/save-team-rankings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",

    ...(csrf
      ? {
          "x-csrf-token": csrf,
        }
      : {}),
  },
      body: JSON.stringify({
        rankings: myRankings,
        lock: true,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(json.error);
      return;
    }

    location.reload();
  }

  return (
    <>
      <div style={{ marginBottom: 25 }}>
        <input
          type="text"
          placeholder="Search team"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            fontSize: 16,
            outline: "none",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 1fr",
          gap: 30,
          alignItems: "start",
        }}
      >
        {/* CONSENSUS */}

        <div>
          <h2
            style={{
              marginBottom: 20,
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            ESPN Consensus
          </h2>

          {filteredConsensus.map((team: any) => (
            <div
              key={team.team}
              style={{
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "14px 18px",
  marginBottom: 8,

  minHeight: 78,

  background: "#172036",

  borderRadius: 12,

  border: "2px solid #1474ce",

  boxSizing: "border-box",
}}
            >
              <div
                style={{
                  width: 30,
                  fontWeight: 800,
                  color: "#94a3b8",
                }}
              >
                {team.consensusRank}
              </div>

              <div
  style={{
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 10,
  }}
>
  <img
    src={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.team?.toLowerCase()}.png`}
    alt={team.team}
    style={{
      width: 46,
      height: 46,
      objectFit: "contain",
      flexShrink: 0,
    }}
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />

  <div>
    <div
      style={{
        fontWeight: 700,
      }}
    >
      {team.team}
    </div>

    
  </div>
</div>
            </div>
          ))}
        </div>

        {/* DELTA */}

        <div>
          <h2
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            Δ
          </h2>

          {filteredMyRankings.map((team: any) => {
            const delta =
              team.consensusRank - team.myRank;

            const color =
              delta > 0
                ? "#22c55e"
                : delta < 0
                ? "#ef4444"
                : "#94a3b8";

            return (
              <div
                key={team.team}
                style={{
                  height: 86,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 800,
                  color,
                  fontSize: 18,
                }}
              >
                {delta === 0
                  ? "—"
                  : delta > 0
                  ? `⬆ +${delta}`
                  : `⬇ ${Math.abs(delta)}`}
              </div>
            );
          })}
        </div>

        {/* MY RANKINGS */}

        <div>
          <h2
            style={{
              marginBottom: 20,
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            My Rankings
          </h2>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredMyRankings.map((p) => p.team)}
              strategy={verticalListSortingStrategy}
            >
              {filteredMyRankings.map((team: any) => (
                <SortableTeam
  key={team.team}
  team={team}
  locked={locked}
/>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {!locked && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 15,
            marginTop: 35,
          }}
        >
          <button
            onClick={saveRankings}
            style={{
              padding: "14px 28px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Save Rankings
          </button>

          <button
            onClick={finalizeRankings}
            style={{
              padding: "14px 28px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            🏆 Finalize Rankings
          </button>
        </div>
      )}
    </>
  );
}