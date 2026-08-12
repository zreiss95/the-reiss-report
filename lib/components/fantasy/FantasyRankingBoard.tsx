"use client";

import { useEffect, useState } from "react";
import FantasySortablePlayer from "../fantasy/FantasySortablePlayer";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function RankingBoard({ position = "Overall", rankings, editable = false }: { position?: string; rankings: any[]; editable?: boolean }) {
  const [myRankings, setMyRankings] = useState([...rankings].sort((a, b) => Number(a.myRank ?? 0) - Number(b.myRank ?? 0)).map((p, index) => ({ ...p, id: p.id ?? `${p.player}-${index}` })));
  const consensusRankings = [...myRankings].sort((a, b) => a.adpRank - b.adpRank);
  const [search, setSearch] = useState("");

  function getCsrfToken() { return document.cookie.split("; ").find((row) => row.startsWith("admin-csrf-token="))?.split("=")[1]; }
  async function saveToDatabase(rankingsToSave: any[], lock = false) {
    const csrf = getCsrfToken();
    await fetch("/api/save-fantasy", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: rankingsToSave, lock }) });
  }
  useEffect(() => { if (rankings?.length) setMyRankings([...rankings].sort((a, b) => Number(a.myRank ?? 0) - Number(b.myRank ?? 0)).map((p, index) => ({ ...p, id: p.id ?? `${p.player}-${index}` }))); }, [rankings]);
  const locked = !editable || (myRankings.length > 0 && myRankings[0].locked === 1);
  const q = search.toLowerCase();
  const matches = (p: any) => p.player.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.position.toLowerCase().includes(q);
  const filteredConsensus = consensusRankings.filter(matches);
  const filteredMyRankings = myRankings.filter(matches);

  function updatePlayer(updated: any) { setMyRankings((prev) => { const next = prev.map((p) => p.id === updated.id ? { ...updated } : p); saveToDatabase(next); return next; }); }
  function handleDragEnd(event: any) {
    if (locked) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = myRankings.findIndex((p) => p.id === active.id);
    const newIndex = myRankings.findIndex((p) => p.id === over.id);
    const reordered = arrayMove([...myRankings], oldIndex, newIndex).map((player, index) => ({ ...player, myRank: index + 1 }));
    setMyRankings(reordered); saveToDatabase(reordered);
  }
  async function saveRankings() {
    const csrf = getCsrfToken();
    const res = await fetch("/api/save-fantasy", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: myRankings, lock: false }) });
    const json = await res.json(); if (!json.success) { alert(json.error); return; } alert("Draft board saved!");
  }
  async function finalizeRankings() {
    if (!confirm("Finalize your draft board? They will become read-only.")) return;
    const csrf = getCsrfToken();
    const res = await fetch("/api/save-fantasy", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: myRankings, lock: true }) });
    const json = await res.json(); if (!json.success) { alert(json.error); return; } location.reload();
  }

  return (
    <div className="fantasy-ranking-board">
      <div className="fantasy-search"><input type="text" placeholder="Search player, team or position..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="fantasy-ranking-grid">
        <div className="fantasy-ranking-column">
          <h2>FantasyPros ADP</h2>
          {filteredConsensus.map((player: any) => {
            const isFreeAgent = ["FA", "FREE AGENT"].includes(player.team?.toUpperCase());
            return <div className="fantasy-ranking-card" key={player.id}>
              <div className="fantasy-rank-number">{player.adpRank}</div>
              {isFreeAgent ? <div className="fantasy-logo fantasy-fa">FA</div> : <img className="fantasy-logo" src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team?.toLowerCase()}.png`} alt={player.team} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />}
              <div className="fantasy-player-info"><div className="fantasy-player-name">{player.player}</div><div className="fantasy-player-meta">{player.position}{player.position && player.team && " • "}{isFreeAgent ? <span className="fantasy-fa-badge">FA</span> : player.team}</div></div>
            </div>;
          })}
        </div>
        <div className="fantasy-delta-column">
          <h2>Δ</h2>
          {filteredMyRankings.map((player: any) => {
            const delta = player.adpRank - player.myRank;
            const color = delta >= 8 ? "#7c3aed" : delta >= 5 ? "#16a34a" : delta >= 2 ? "#22c55e" : delta >= -1 ? "#94a3b8" : delta >= -4 ? "#f59e0b" : "#dc2626";
            const label = delta >= 8 ? "League Winner" : delta >= 5 ? "Elite Value" : delta >= 2 ? "Value" : delta >= -1 ? "Fair" : delta >= -4 ? "Reach" : "Avoid";
            return <div className="fantasy-delta" key={player.id}><div style={{ color }}>{delta > 0 ? `+${delta}` : delta}</div><div style={{ color }}>{label}</div></div>;
          })}
        </div>
        <div className="fantasy-ranking-column">
          <h2>My Rankings</h2>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredMyRankings.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {filteredMyRankings.map((player: any) => <FantasySortablePlayer key={player.id} player={player} locked={locked} showFavorite={true} onChange={updatePlayer} />)}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      {!locked && <div className="fantasy-ranking-actions"><button onClick={saveRankings}>Save Draft Board</button><button onClick={finalizeRankings}>🏆 Finalize Draft Board</button></div>}
    </div>
  );
}
