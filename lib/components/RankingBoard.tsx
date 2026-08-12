"use client";
import { useEffect, useMemo, useState } from "react";
import SortablePlayer from "./rankings/SortablePlayer";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function RankingBoard({ position, rankings, editable = false }: { position: string; rankings: any[]; editable?: boolean }) {
  const normalizedPosition = position.toUpperCase();
  const makeMine = () => rankings.slice().sort((a,b)=>Number(a.myRank)-Number(b.myRank)).map(p=>({...p, originalPlayer:p.originalPlayer ?? p.player}));
  const makeConsensus = () => rankings.slice().sort((a,b)=>Number(a.consensusRank)-Number(b.consensusRank)).map(p=>({...p, originalPlayer:p.originalPlayer ?? p.player}));
  const [myRankings,setMyRankings]=useState(makeMine());
  const [consensusRankings,setConsensusRankings]=useState(makeConsensus());
  const [search,setSearch]=useState("");
  const locked=!editable || (myRankings.length>0 && myRankings[0].locked===1);
  useEffect(()=>{setMyRankings(makeMine());setConsensusRankings(makeConsensus());},[rankings]);
  const matches=(p:any)=>{const q=search.toLowerCase();return String(p.player??"").toLowerCase().includes(q)||String(p.team??"").toLowerCase().includes(q);};
  const sortedConsensus=useMemo(()=>[...consensusRankings].sort((a,b)=>Number(a.consensusRank)-Number(b.consensusRank)),[consensusRankings]);
  const filteredConsensus=sortedConsensus.filter(matches); const filteredMine=myRankings.filter(matches);
  function updatePlayer(updated:any){setMyRankings(prev=>prev.map(p=>p.id===updated.id||p.originalPlayer===updated.originalPlayer?{...p,...updated}:p));}
  function updateConsensus(updated:any){setConsensusRankings(prev=>prev.map(p=>p.id===updated.id||p.originalPlayer===updated.originalPlayer?{...p,...updated}:p));setMyRankings(prev=>prev.map(p=>p.id===updated.id||p.originalPlayer===updated.originalPlayer?{...p,player:updated.player,team:updated.team,position:updated.position}:p));}
  function handleDragEnd(event:any){if(locked)return;const{active,over}=event;if(!over||active.id===over.id)return;const oldIndex=myRankings.findIndex(p=>p.player===active.id),newIndex=myRankings.findIndex(p=>p.player===over.id);if(oldIndex<0||newIndex<0)return;setMyRankings(arrayMove(myRankings,oldIndex,newIndex).map((p,index)=>({...p,myRank:index+1})));}
  async function saveRankings(){const csrf=document.cookie.split("; ").find(r=>r.startsWith("admin-csrf-token="))?.split("=")[1];const res=await fetch("/api/save-rankings",{method:"POST",headers:{"Content-Type":"application/json",...(csrf?{"x-csrf-token":csrf}:{})},body:JSON.stringify({position:normalizedPosition,rankings:myRankings,lock:false})});const json=await res.json();if(!json.success){alert(json.error||"Save failed");return;}alert("Rankings saved!");}
  async function finalizeRankings(){if(!confirm("Finalize these rankings?"))return;const csrf=document.cookie.split("; ").find(r=>r.startsWith("admin-csrf-token="))?.split("=")[1];const res=await fetch("/api/save-rankings",{method:"POST",headers:{"Content-Type":"application/json",...(csrf?{"x-csrf-token":csrf}:{})},body:JSON.stringify({position:normalizedPosition,rankings:myRankings,lock:true})});const json=await res.json();if(!json.success){alert(json.error||"Finalize failed");return;}location.reload();}
  return <div className="player-ranking-board">
    <input className="player-ranking-search" placeholder="Search player or team..." value={search} onChange={e=>setSearch(e.target.value)}/>
    <div className="player-ranking-grid">
      <div className="player-ranking-column"><h2>NFL.com Consensus</h2>{filteredConsensus.map((player,index)=><SortablePlayer key={player.id??player.player} rankType="consensus" player={{...player,consensusRank:index+1,showPosition:true}} locked={!editable} showFavorite={false} onChange={editable?updateConsensus:undefined}/>)}</div>
      <div className="player-ranking-delta-column"><h2>Δ</h2>{filteredMine.map(player=>{const delta=Number(player.consensusRank)-Number(player.myRank);const deltaColor=delta>0?"#22c55e":delta<0?"#ef4444":"#94a3b8";return <div className="player-ranking-delta" style={{color:deltaColor}} key={player.id??player.player}>{delta===0?"—":delta>0?`⬆ +${delta}`:`⬇ -${Math.abs(delta)}`}</div>})}</div>
      <div className="player-ranking-column"><h2>My Rankings</h2><DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={filteredMine.map(p=>p.player)} strategy={verticalListSortingStrategy}>{filteredMine.map(player=><SortablePlayer key={player.id??player.player} player={{...player,showPosition:true}} locked={locked} showFavorite={false} onChange={updatePlayer}/>)}</SortableContext></DndContext></div>
    </div>
    {!locked&&<div className="player-ranking-actions"><button onClick={saveRankings}>Save Rankings</button><button onClick={finalizeRankings}>🏆 Finalize Rankings</button></div>}
  </div>;
}
