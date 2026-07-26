"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

export default function SortablePlayer({
  player,
  locked,
  showFavorite = true,
  onChange,
}: {
  player: any;
  locked: boolean;
  showFavorite?: boolean;
  onChange?: (updatedPlayer: any) => void;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: player.id,
    disabled: locked,
  });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(player.player);
  const [team, setTeam] = useState(player.team ?? "");
  const [position, setPosition] = useState(player.position ?? "");



  useEffect(() => {
    setName(player.player);
    setTeam(player.team ?? "");
    setPosition(player.position ?? "");
  }, [player]);



  function saveEdit() {

    if (!onChange) return;


    onChange({
      ...player,
      id: player.id,
      originalPlayer: player.originalPlayer ?? player.player,

      player: name.trim(),
      team: team.trim().toUpperCase(),
      position: position.trim().toUpperCase(),
    });


    setEditing(false);
  }



  function cancelEdit() {
    setName(player.player);
    setTeam(player.team ?? "");
    setPosition(player.position ?? "");
    setEditing(false);
  }



  const isFreeAgent =
    player.team?.toUpperCase() === "FA" ||
    player.team?.toUpperCase() === "FREE AGENT";



  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        marginBottom: 8,
        background: isDragging ? "#1e293b" : "#172036",
        borderRadius: 12,
        border: "2px solid #1474ce",
        opacity: locked ? 0.85 : isDragging ? 0.6 : 1,
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
        {player.myRank}
      </div>




      {/* Team Logo */}
      {!isFreeAgent ? (
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
      ) : (
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
      )}






      {/* Player Information */}
      <div style={{ flex: 1 }}>

        {editing ? (

          <>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: 6,
                background: "#111827",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 6,
                fontWeight: 700,
              }}
            />



            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 6,
              }}
            >

              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Pos"
                style={{
                  width: 70,
                  padding: 6,
                  background: "#111827",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: 6,
                }}
              />


              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Team"
                style={{
                  width: 70,
                  padding: 6,
                  background: "#111827",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: 6,
                }}
              />



              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={saveEdit}
                style={{
                  padding: "6px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Save
              </button>



              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={cancelEdit}
                style={{
                  padding: "6px 12px",
                  background: "#475569",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>


            </div>

          </>


        ) : (

          <>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                fontSize: 16,
              }}
            >

              <span>
                {player.player}
              </span>


              {player.analysis && (
                <span
                  style={{
                    color: "#60a5fa",
                    fontSize: 15,
                  }}
                >
                  📝
                </span>
              )}

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


          </>

        )}

      </div>






      {/* Edit Button */}
      {!locked && onChange && !editing && (

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setEditing(true)}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
            marginRight: 6,
          }}
        >
          ✏️
        </button>

      )}







      {/* Favorite */}
      {showFavorite && player.favorite === 1 && (

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={async (e) => {

            e.preventDefault();
            e.stopPropagation();


            await fetch("/api/toggle-favorite", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                player:
                  player.originalPlayer ??
                  player.player,
                season: 2026,
              }),
            });


            window.location.reload();

          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            padding: 0,
            color: "#facc15",
            flexShrink: 0,
          }}
        >
          ⭐
        </button>

      )}






      {/* Drag Handle */}
      {!locked && (

        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            fontSize: 24,
            color: "#94a3b8",
            padding: "0 8px",
            userSelect: "none",
          }}
        >
          ☰
        </div>

      )}


    </div>
  );
}