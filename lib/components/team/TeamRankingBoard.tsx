"use client";

import { useEffect, useMemo, useState } from "react";
import SortableTeam from "./SortableTeam";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function RankingBoard({ rankings, editable = false }: { rankings: any[]; editable?: boolean }) {
  const consensusRankings = useMemo(() => [...rankings].sort((a, b) => a.consensusRank - b.consensusRank), [rankings]);
  const [myRankings, setMyRankings] = useState([...rankings].sort((a, b) => a.myRank - b.myRank));
  const [search, setSearch] = useState("");

  function getCsrfToken() { return document.cookie.split("; ").find((row) => row.startsWith("admin-csrf-token="))?.split("=")[1]; }
  useEffect(() => { setMyRankings(rankings.map((p) => ({ ...p }))); }, [rankings]);
  const locked = !editable || (myRankings.length > 0 && myRankings[0].locked === 1);
  const q = search.toLowerCase();
  const filteredConsensus = consensusRankings.filter((team) => team.team.toLowerCase().includes(q));
  const filteredMyRankings = myRankings.filter((team) => team.team.toLowerCase().includes(q));

  function handleDragEnd(event: any) {
    if (locked) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = myRankings.findIndex((p) => p.team === active.id), newIndex = myRankings.findIndex((p) => p.team === over.id);
    const reordered = arrayMove([...myRankings], oldIndex, newIndex).map((team, index) => ({ ...team, myRank: index + 1 }));
    setMyRankings(reordered);
    const csrf = getCsrfToken();
    fetch("/api/save-team-rankings", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: reordered, lock: false }) });
  }
  async function saveRankings() {
    const csrf = getCsrfToken();
    const res = await fetch("/api/save-team-rankings", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: myRankings, lock: false }) });
    const json = await res.json(); if (!json.success) { alert(json.error); return; } alert("Team rankings saved!");
  }
  async function finalizeRankings() {
    if (!confirm("Finalize team rankings? They will become read-only.")) return;
    const csrf = getCsrfToken();
    const res = await fetch("/api/save-team-rankings", { method: "POST", headers: { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) }, body: JSON.stringify({ rankings: myRankings, lock: true }) });
    const json = await res.json(); if (!json.success) { alert(json.error); return; } location.reload();
  }

  return (
    <div className="team-ranking-board">
      <div className="team-ranking-search"><input type="text" placeholder="Search team" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="team-ranking-grid">
        <div><h2>ESPN Consensus</h2>{filteredConsensus.map((team: any) => <div className="team-ranking-card" key={team.team}><div className="team-ranking-rank">{team.consensusRank}</div><div className="team-ranking-name"><img src={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.team?.toLowerCase()}.png`} alt={team.team} onError={(e) => { e.currentTarget.style.display = "none"; }} /><span>{team.team}</span></div></div>)}</div>
        <div className="team-ranking-delta-column"><h2>Δ</h2>{filteredMyRankings.map((team: any) => { const delta = team.consensusRank - team.myRank; return <div className={`team-ranking-delta ${delta > 0 ? "up" : delta < 0 ? "down" : "flat"}`} key={team.team}>{delta === 0 ? "—" : delta > 0 ? `⬆ +${delta}` : `⬇ ${Math.abs(delta)}`}</div>; })}</div>
        <div><h2>My Rankings</h2><DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={filteredMyRankings.map((p) => p.team)} strategy={verticalListSortingStrategy}>{filteredMyRankings.map((team: any) => <SortableTeam key={team.team} team={team} locked={locked} />)}</SortableContext></DndContext></div>
      </div>
      {!locked && <div className="team-ranking-actions"><button className="team-ranking-save" onClick={saveRankings}>Save Rankings</button><button className="team-ranking-finalize" onClick={finalizeRankings}>🏆 Finalize Rankings</button></div>}
      <style jsx>{`@media(max-width:700px){.team-ranking-grid{grid-template-columns:minmax(0,1fr) 54px minmax(0,1fr)!important;gap:5px!important}.team-ranking-grid h2{font-size:17px!important;line-height:1.15!important;margin-bottom:14px!important}.team-ranking-card,.sortable-team{height:68px!important;min-height:68px!important;padding:8px 7px!important;gap:6px!important;margin-bottom:8px!important}.team-ranking-name img,.sortable-team img{width:34px!important;height:34px!important;flex-basis:34px!important}.team-ranking-rank,.sortable-team-rank{width:20px!important;flex-basis:20px!important;font-size:12px}.team-ranking-name span,.sortable-team-name{font-size:12px!important;line-height:1.1!important}.team-ranking-delta-column{display:block!important}.team-ranking-delta{height:76px!important;min-height:76px!important;font-size:15px!important}.team-ranking-actions{grid-column:1/-1}}`}</style>
    </div>
  );
}
