"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

export default function SortablePlayer({ player, locked, showFavorite = true, onChange }: { player: any; locked: boolean; showFavorite?: boolean; onChange?: (updatedPlayer: any) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id, disabled: locked });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.player);
  const [team, setTeam] = useState(player.team ?? "");
  const [position, setPosition] = useState(player.position ?? "");
  useEffect(() => { setName(player.player); setTeam(player.team ?? ""); setPosition(player.position ?? ""); }, [player]);
  const isFreeAgent = ["FA", "FREE AGENT"].includes(player.team?.toUpperCase());
  const saveEdit = () => { if (!onChange) return; onChange({ ...player, id: player.id, originalPlayer: player.originalPlayer ?? player.player, player: name.trim(), team: team.trim().toUpperCase(), position: position.trim().toUpperCase() }); setEditing(false); };
  const cancelEdit = () => { setName(player.player); setTeam(player.team ?? ""); setPosition(player.position ?? ""); setEditing(false); };

  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: locked ? .85 : isDragging ? .6 : 1 }} className="fantasy-sortable-player">
    <div className="fantasy-sortable-rank">{player.myRank}</div>
    {isFreeAgent ? <div className="fantasy-sortable-logo fantasy-fa">FA</div> : <img className="fantasy-sortable-logo" src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team?.toLowerCase()}.png`} alt={player.team} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />}
    <div className="fantasy-sortable-info">
      {editing ? <>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="fantasy-edit-fields"><input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Pos" /><input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team" /><button onPointerDown={(e) => e.stopPropagation()} onClick={saveEdit}>Save</button><button onPointerDown={(e) => e.stopPropagation()} onClick={cancelEdit}>Cancel</button></div>
      </> : <>
        <div className="fantasy-sortable-name"><span>{player.player}</span>{player.analysis && <span>📝</span>}</div>
        <div className="fantasy-sortable-meta">{player.position}{player.position && player.team && " • "}{isFreeAgent ? <span className="fantasy-fa-badge">FA</span> : player.team}</div>
      </>}
    </div>
    {!locked && onChange && !editing && <button className="fantasy-edit-button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setEditing(true)}>✏️</button>}
    {showFavorite && player.favorite === 1 && <button className="fantasy-favorite" onPointerDown={(e) => e.stopPropagation()} onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await fetch("/api/toggle-favorite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ player: player.originalPlayer ?? player.player, season: 2026 }) }); window.location.reload(); }}>⭐</button>}
    {!locked && <div {...attributes} {...listeners} className="fantasy-drag-handle" aria-label={`Drag ${player.player}`}>☰</div>}
  </div>;
}
