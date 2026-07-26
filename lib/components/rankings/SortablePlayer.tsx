"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SortablePlayer({
  player,
  locked,
  showFavorite = true,
  onChange,
  rankType = "my",
}: {
  player: any;
  locked: boolean;
  showFavorite?: boolean;
  onChange?: (updatedPlayer: any) => void;
  rankType?: "my" | "consensus";
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: player.player,
    disabled: locked,
  });


  const [editing, setEditing] = useState(false);

  const [name, setName] =
    useState(player.player);

  const [team, setTeam] =
    useState(player.team ?? "");


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const logoTeam =
    (
      player.team ||
      player.player ||
      ""
    ).toLowerCase();



  function saveEdit() {

    if (!onChange) return;


    onChange({
      ...player,
      originalPlayer: player.player,
      player: name.trim(),
      team: team.toUpperCase().trim(),
      position: player.position,
    });


    setEditing(false);
  }



  const displayedRank =
    rankType === "consensus"
      ? player.consensusRank
      : player.myRank;



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
        background: isDragging
          ? "#1e293b"
          : "#172036",
        borderRadius: 12,
        border: "2px solid #1474ce",
        opacity:
          locked
            ? .85
            : isDragging
              ? .6
              : 1,
      }}
    >


      <div
        style={{
          width: 30,
          textAlign: "center",
          fontWeight: 800,
          color: "#94a3b8",
          flexShrink: 0,
        }}
      >
        {displayedRank}
      </div>



      {showFavorite && (

        <button
          onPointerDown={(e) =>
            e.stopPropagation()
          }
          onClick={async (e) => {

            e.preventDefault();


            await fetch(
              "/api/toggle-favorite",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  player: player.player,
                  season: 2026,
                }),
              }
            );


            window.location.reload();

          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          {player.favorite === 1
            ? "⭐"
            : "☆"}
        </button>

      )}



      <img
        src={`https://a.espncdn.com/i/teamlogos/nfl/500/${logoTeam}.png`}
        style={{
          width: 46,
          height: 46,
          objectFit: "contain",
          flexShrink: 0,
        }}
        onError={(e) =>
          e.currentTarget.style.display = "none"
        }
      />



      <div
        style={{
          flex: 1,
        }}
      >


        {editing ? (

          <div>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={{
                width: "100%",
                background: "#111827",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 6,
                padding: 6,
                fontWeight: 700,
              }}
            />


            <input
              value={team}
              onChange={(e) =>
                setTeam(e.target.value)
              }
              style={{
                marginTop: 6,
                width: 90,
                background: "#111827",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 6,
                padding: 5,
              }}
            />


            <button
              onClick={saveEdit}
              style={{
                marginLeft: 8,
                padding: "5px 10px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 6,
              }}
            >
              Save
            </button>

          </div>


        ) : (

          <>

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
              {player.team}
            </div>

          </>

        )}



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



      {!locked && (

        <button
          onPointerDown={(e) =>
            e.stopPropagation()
          }
          onClick={() =>
            setEditing(true)
          }
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
          }}
        >
          ✏️
        </button>

      )}



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