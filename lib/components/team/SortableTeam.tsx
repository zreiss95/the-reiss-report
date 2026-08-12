"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTeam({ team, locked }: { team: any; locked: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: team.team, disabled: locked });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-team ${locked ? "locked" : ""} ${isDragging ? "dragging" : ""}`}>
      <div className="sortable-team-rank">{team.myRank}</div>
      <img src={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.team.toLowerCase()}.png`} alt={team.team} onError={(e) => { e.currentTarget.style.display = "none"; }} />
      <div className="sortable-team-name"><span>{team.team}</span>{team.analysis && <span className="sortable-team-note">📝</span>}</div>
      {!locked && <div {...attributes} {...listeners} className="sortable-team-handle" aria-label={`Drag ${team.team}`}>☰</div>}
    </div>
  );
}
