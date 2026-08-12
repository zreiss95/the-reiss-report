"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SortablePlayer({player,locked,showFavorite=true,onChange,rankType="my"}:{player:any;locked:boolean;showFavorite?:boolean;onChange?:(updatedPlayer:any)=>void;rankType?:"my"|"consensus"}){
 const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:player.player,disabled:locked});
 const [editing,setEditing]=useState(false); const [name,setName]=useState(player.player); const [team,setTeam]=useState(player.team??"");
 const displayedRank=rankType==="consensus"?player.consensusRank:player.myRank;
 function saveEdit(){if(!onChange)return;onChange({...player,originalPlayer:player.originalPlayer??player.player,player:name.trim(),team:team.toUpperCase().trim(),position:player.position});setEditing(false);}
 const logoTeam=(player.team||player.player||"").toLowerCase();
 return <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:locked?.85:isDragging?.6:1}} className="player-sortable-row">
   <div className="player-sortable-rank">{displayedRank}</div>
   {showFavorite&&<button className="player-favorite">{player.favorite===1?"⭐":"☆"}</button>}
   <img className="player-sortable-logo" src={`https://a.espncdn.com/i/teamlogos/nfl/500/${logoTeam}.png`} alt={player.team} onError={e=>{e.currentTarget.style.visibility="hidden";}}/>
   <div className="player-sortable-info">{editing?<div className="player-edit"><input value={name} onChange={e=>setName(e.target.value)}/><div><input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team"/><button onClick={saveEdit}>Save</button></div></div>:<><div className="player-sortable-name">{player.player}{player.analysis&&<span>📝</span>}</div><div className="player-sortable-meta">{player.team}</div></>}</div>
   {!locked&&<button className="player-edit-button" onPointerDown={e=>e.stopPropagation()} onClick={()=>setEditing(true)}>✏️</button>}
   {!locked&&<div {...attributes} {...listeners} className="player-drag-handle">☰</div>}
 </div>;
}
