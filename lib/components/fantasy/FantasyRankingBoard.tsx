"use client";

import { useEffect, useState } from "react";
import FantasySortablePlayer from "../fantasy/FantasySortablePlayer";

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
  position = "Overall",
  rankings,
  editable = false,
}: {
  position?: string;
  rankings: any[];
  editable?: boolean;
}) {

// Independent editable copy (single source of truth)
const [myRankings, setMyRankings] = useState(
  rankings.map((p, index) => ({
    ...p,
    id: p.id ?? `${p.player}-${index}`,
  }))
);


// FantasyPros ADP column now reflects edits
const consensusRankings = [...myRankings].sort(
  (a, b) => a.adpRank - b.adpRank
);


const [search, setSearch] = useState("");



const filteredConsensus = consensusRankings.filter((player) => {
  const q = search.toLowerCase();

  return (
    player.player.toLowerCase().includes(q) ||
    player.team.toLowerCase().includes(q) ||
    player.position.toLowerCase().includes(q)
  );
});



const filteredMyRankings = myRankings.filter((player) => {
  const q = search.toLowerCase();

  return (
    player.player.toLowerCase().includes(q) ||
    player.team.toLowerCase().includes(q) ||
    player.position.toLowerCase().includes(q)
  );
});



useEffect(() => {
  if (!rankings?.length) return;

  setMyRankings(
    [...rankings]
      .sort((a, b) => a.myRank - b.myRank)
      .map((p, index) => ({
        ...p,
        id: p.id ?? `${p.player}-${index}`,
      }))
  );
}, [rankings]);



const locked =
  !editable ||
  (myRankings.length > 0 && myRankings[0].locked === 1);



// Handles player edits from FantasySortablePlayer
function updatePlayer(updated: any) {

  setMyRankings((prev) => {
    const updatedRankings = prev.map((p) =>
      p.id === updated.id
        ? {
            ...updated,
          }
        : p
    );


    fetch("/api/save-fantasy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rankings: updatedRankings,
        lock: false,
      }),
    });


    return updatedRankings;
  });

}




  function handleDragEnd(event: any) {
    if (locked) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;


    const oldIndex = myRankings.findIndex(
      (p) => p.id === active.id
    );


    const newIndex = myRankings.findIndex(
      (p) => p.id === over.id
    );


    const reordered = arrayMove(
      [...myRankings],
      oldIndex,
      newIndex
    ).map((player, index) => ({
      ...player,
      myRank: index + 1,
    }));


    setMyRankings(reordered);


    fetch("/api/save-fantasy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rankings: reordered,
        lock: false,
      }),
    });
  }




  async function saveRankings() {
    const res = await fetch("/api/save-fantasy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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


    alert("Draft board saved!");
  }





  async function finalizeRankings() {
    if (
      !confirm(
        "Finalize your draft board? They will become read-only."
      )
    ) {
      return;
    }


    const res = await fetch("/api/save-fantasy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      <div
        style={{
          marginBottom: 30,
        }}
      >
        <input
          type="text"
          placeholder="Search player, team or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "#111827",
            color: "white",
            border: "1px solid #334155",
            borderRadius: 10,
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


        {/* FANTASYPROS ADP */}

<div>
  <h2
    style={{
      marginBottom: 20,
      fontSize: 26,
      fontWeight: 800,
    }}
  >
    FantasyPros ADP
  </h2>


  {filteredConsensus.map((player: any) => {

    const isFreeAgent =
      player.team?.toUpperCase() === "FA" ||
      player.team?.toUpperCase() === "FREE AGENT";


    return (
      <div
        key={player.id ?? player.player}
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

        {/* Rank */}
        <div
          style={{
            width: 30,
            textAlign: "center",
            fontWeight: 800,
            color: "#94a3b8",
            flexShrink: 0,
          }}
        >
          {player.adpRank}
        </div>



        {/* Team Logo / FA Badge */}
        {isFreeAgent ? (

          <div
            style={{
              width: 46,
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 8,
              background: "#475569",
              color: "#e2e8f0",
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            FA
          </div>

        ) : (

          <img
            src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team?.toLowerCase()}.png`}
            alt={player.team}
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

        )}



        {/* Player Info */}
        <div
          style={{
            flex: 1,
          }}
        >

          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {player.player}
          </div>



          <div
            style={{
              color: "#94a3b8",
              fontSize: 13,
              marginTop: 2,
            }}
          >

            {player.position}

            {player.position && player.team && " • "}


            {isFreeAgent ? (

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: "#475569",
                  color: "#e2e8f0",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                FA
              </span>

            ) : (

              player.team

            )}

          </div>

        </div>


      </div>
    );

  })}

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


          {filteredMyRankings.map((player: any) => {

            const delta = player.adpRank - player.myRank;


            let label = "";
            let color = "";


            if (delta >= 8) {
              label = "League Winner";
              color = "#7c3aed";
            } else if (delta >= 5) {
              label = "Elite Value";
              color = "#16a34a";
            } else if (delta >= 2) {
              label = "Value";
              color = "#22c55e";
            } else if (delta >= -1) {
              label = "Fair";
              color = "#94a3b8";
            } else if (delta >= -4) {
              label = "Reach";
              color = "#f59e0b";
            } else {
              label = "Avoid";
              color = "#dc2626";
            }


            return (
              <div
                key={player.id}
                style={{
                  height: 86,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 3,
                }}
              >

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color,
                  }}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </div>


                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>

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
              items={filteredMyRankings.map(
                (p) => p.id
              )}
              strategy={verticalListSortingStrategy}
            >

              {filteredMyRankings.map((player: any) => (

                <FantasySortablePlayer
                  key={player.id}
                  player={player}
                  locked={locked}
                  showFavorite={true}
                  onChange={updatePlayer}
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
            Save Draft Board
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
            🏆 Finalize Draft Board
          </button>


        </div>

      )}

    </>
  );
}