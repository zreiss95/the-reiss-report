"use client";

import { useEffect, useMemo, useState } from "react";
import SortablePlayer from "./rankings/SortablePlayer";

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
  position,
  rankings,
  editable = false,
}: {
  position: string;
  rankings: any[];
  editable?: boolean;
}) {

  const normalizedPosition =
    position.toUpperCase();


const [myRankings, setMyRankings] =
  useState(
    rankings
      .slice()
      .sort(
        (a, b) =>
          Number(a.myRank) - Number(b.myRank)
      )
      .map(p => ({
        ...p,
        originalPlayer: p.player,
      }))
  );


const [consensusRankings, setConsensusRankings] =
  useState(
    rankings
      .slice()
      .sort(
        (a, b) =>
          Number(a.consensusRank) -
          Number(b.consensusRank)
      )
      .map(p => ({
        ...p,
        originalPlayer: p.player,
      }))
  );


  const [search, setSearch] =
    useState("");
function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) =>
      row.startsWith("admin-csrf-token=")
    )
    ?.split("=")[1];
}


  useEffect(() => {

  setMyRankings(
    rankings
      .slice()
      .sort(
        (a, b) =>
          Number(a.myRank) - Number(b.myRank)
      )
      .map(p => ({
        ...p,
        originalPlayer: p.player,
      }))
  );


  setConsensusRankings(
    rankings
      .slice()
      .sort(
        (a, b) =>
          Number(a.consensusRank) -
          Number(b.consensusRank)
      )
      .map(p => ({
        ...p,
        originalPlayer: p.player,
      }))
  );

}, [rankings]);



  const locked =
    !editable ||
    (
      myRankings.length > 0 &&
      myRankings[0].locked === 1
    );



  const sortedConsensus =
    useMemo(() => {

      return [...consensusRankings].sort(
        (a,b) =>
          Number(a.consensusRank) -
          Number(b.consensusRank)
      );

    }, [consensusRankings]);



  function matchesSearch(player:any){

    const q =
      search.toLowerCase();


    return (
      String(player.player ?? "")
        .toLowerCase()
        .includes(q)
      ||
      String(player.team ?? "")
        .toLowerCase()
        .includes(q)
    );

  }



 function updatePlayer(updated:any){

  setMyRankings(prev =>
    prev.map(p =>
      p.id === updated.id ||
      p.originalPlayer === updated.originalPlayer
        ? {
            ...p,
            ...updated,
            originalPlayer:
              p.originalPlayer ?? p.player,
          }
        : p
    )
  );

}




  function updateConsensus(updated:any){

  setConsensusRankings(prev =>
    prev.map(p =>
      p.id === updated.id ||
      p.originalPlayer === updated.originalPlayer
        ? {
            ...p,
            ...updated,
            originalPlayer:
              p.originalPlayer ?? p.player,
          }
        : p
    )
  );


  // Keep My Rankings synced when fixing spelling/team
  setMyRankings(prev =>
    prev.map(p =>
      p.id === updated.id ||
      p.originalPlayer === updated.originalPlayer
        ? {
            ...p,
            player: updated.player,
            team: updated.team,
            position: updated.position,
          }
        : p
    )
  );

}




  function handleDragEnd(event:any){

    if(locked)
      return;


    const {
      active,
      over,
    } = event;


    if(
      !over ||
      active.id === over.id
    )
      return;


    const oldIndex =
      myRankings.findIndex(
        p => p.player === active.id
      );


    const newIndex =
      myRankings.findIndex(
        p => p.player === over.id
      );


    if(
      oldIndex === -1 ||
      newIndex === -1
    )
      return;


    setMyRankings(
      arrayMove(
        myRankings,
        oldIndex,
        newIndex
      )
      .map(
        (p,index)=>({
          ...p,
          myRank:index + 1,
        })
      )
    );

  }





async function saveRankings(){

  const csrf = getCsrfToken();

  const res =
    await fetch(
      "/api/save-rankings",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",

          ...(csrf
            ? {
                "x-csrf-token": csrf,
              }
            : {}),
        },

        body:JSON.stringify({

          position:
            normalizedPosition,

          rankings:
            myRankings,

          lock:false,

        }),
      }
    );


  const json =
    await res.json();


  if(!json.success){

    alert(
      json.error ||
      "Save failed"
    );

    return;
  }


  alert(
    "Rankings saved!"
  );

}



async function finalizeRankings(){

  if(
    !confirm(
      "Finalize these rankings?"
    )
  )
    return;


  const csrf = getCsrfToken();


  const res =
    await fetch(
      "/api/save-rankings",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",

          ...(csrf
            ? {
                "x-csrf-token": csrf,
              }
            : {}),
        },

        body:JSON.stringify({

          position:
            normalizedPosition,

          rankings:
            myRankings,

          lock:true,

        }),
      }
    );


  const json =
    await res.json();


  if(!json.success){

    alert(
      json.error ||
      "Finalize failed"
    );

    return;
  }


  location.reload();

}





return (

<>

<input
  placeholder="Search player or team..."
  value={search}
  onChange={(e)=>
    setSearch(e.target.value)
  }
  style={{
    width:"100%",
    padding:"14px 18px",
    borderRadius:10,
    border:"1px solid #334155",
    background:"#111827",
    color:"white",
    marginBottom:25,
  }}
/>



<div
style={{
  display:"grid",
  gridTemplateColumns:"minmax(0,1fr) 120px minmax(0,1fr)",
  gap:30,
  alignItems:"start",
}}
>


{/* CONSENSUS */}

<div>

<h2>
NFL.com Consensus
</h2>


{
sortedConsensus
.filter(matchesSearch)
.map((player, index) => (

<SortablePlayer
key={player.id ?? player.player}
rankType="consensus"
player={{
  ...player,
  consensusRank: index + 1,
  showPosition:true,
}}

locked={!editable}

showFavorite={false}

onChange={
  editable
  ? updateConsensus
  : undefined
}

/>

))
}

</div>





{/* DELTA */}

<div>

<h2
style={{
  textAlign:"center",
}}
>
Δ
</h2>


{
myRankings
.filter(matchesSearch)
.map(player=>{

  const delta =
    Number(player.consensusRank) -
    Number(player.myRank);


  return (

    <div
    key={player.id ?? player.player}
    style={{
      height:86,
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontWeight:800,
      fontSize:16,
      color:
        delta > 0
          ? "#22c55e"
          : delta < 0
          ? "#ef4444"
          : "#94a3b8",
    }}
    >

    {
      delta === 0
        ? "—"
        : delta > 0
        ? `⬆ +${delta}`
        : `⬇ -${Math.abs(delta)}`
    }

    </div>

  );

})
}

</div>




{/* MY RANKINGS */}

<div>

<h2>
My Rankings
</h2>


<DndContext
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>


<SortableContext

items={
myRankings
.filter(matchesSearch)
.map(p=>p.player)
}

strategy={
verticalListSortingStrategy
}

>


{
myRankings
.filter(matchesSearch)
.map(player => (

<SortablePlayer

key={player.id ?? player.player}

player={{
  ...player,
  showPosition:true,
}}

locked={locked}

showFavorite={false}

onChange={updatePlayer}

/>

))
}


</SortableContext>


</DndContext>

</div>


</div>





{!locked &&

<div
style={{
  marginTop:35,
  display:"flex",
  justifyContent:"center",
  gap:15,
}}
>

<button
onClick={saveRankings}
style={{
  padding:"14px 28px",
  background:"#16a34a",
  color:"white",
  border:"none",
  borderRadius:10,
  fontWeight:700,
  cursor:"pointer",
  fontSize:16,
}}
>
Save Rankings
</button>


<button
onClick={finalizeRankings}
style={{
  padding:"14px 28px",
  background:"#dc2626",
  color:"white",
  border:"none",
  borderRadius:10,
  fontWeight:700,
  cursor:"pointer",
  fontSize:16,
}}
>
🏆 Finalize Rankings
</button>


</div>

}


</>

);

}