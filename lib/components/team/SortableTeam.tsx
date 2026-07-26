"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTeam({
  team,
  locked,
}: {
  team: any;
  locked: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: team.team,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
        border: "2px solid #2563eb",
        opacity: locked ? 0.85 : isDragging ? 0.6 : 1,
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 30,
          textAlign: "center",
          fontWeight: 800,
          color: "#94a3b8",
        }}
      >
        {team.myRank}
      </div>

      {/* Team Logo */}
      <img
        src={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.team.toLowerCase()}.png`}
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

      {/* Team */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <span>{team.team}</span>

          {team.analysis && (
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
      </div>

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