"use client";

import { useState, useRef } from "react";
import GameCard from "./GameCard";

export default function AdminEditor({
  games,
  existingPicks,
}: {
  games: any[];
  existingPicks: any[];
}) {
const [selectedGameId, setSelectedGameId] = useState("");
const [moneylinePick, setMoneylinePick] = useState("");
const [atsPick, setAtsPick] = useState("");
const [spread, setSpread] = useState("");
const [confidence, setConfidence] = useState(90);
const [analysis, setAnalysis] = useState("");
const [totalLine, setTotalLine] = useState("");
const [totalPick, setTotalPick] = useState("");
const [saved, setSaved] = useState(false);

const [featuredMoneyline, setFeaturedMoneyline] =
  useState(false);

const [featuredATS, setFeaturedATS] =
  useState(false);

const [featuredTotal, setFeaturedTotal] =
  useState(false);

const editorRef = useRef<HTMLDivElement>(null);


const selectedGame = games.find(
  (game) => game.id === selectedGameId
);

  const competition = selectedGame?.competitions?.[0];

  const home = competition?.competitors.find(
    (c: any) => c.homeAway === "home"
  );

  const away = competition?.competitors.find(
    (c: any) => c.homeAway === "away"
  );

const handleSave = async () => {
  if (!selectedGame || !competition || !home || !away) {
    alert("Game data is unavailable.");
    return;
  }


  if (!moneylinePick || !atsPick) {
    alert("Please select both a Moneyline and ATS pick before saving.");
    return;
  }


  const csrfToken =
    document.cookie
      .split("; ")
      .find((row) =>
        row.startsWith("admin-csrf-token=")
      )
      ?.split("=")[1];


  console.log(
    "CSRF TOKEN:",
    csrfToken
  );


  const response = await fetch("/api/picks", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken ?? "",
    },

    body: JSON.stringify({

      gameId:
        selectedGame.id,


      week:
        selectedGame.week?.number ??
        selectedGame.week ??
        1,


      away:
        away.team.displayName,


      home:
        home.team.displayName,


      awayLogo:
        away.team.logo,


      homeLogo:
        home.team.logo,


      atsPick,


      moneylinePick,


      spread:
        Number(spread || 0),


      totalLine:
        Number(totalLine || 0),


      totalPick,


      confidence,


      analysis,


      kickoff:
        competition.date,


      featuredMoneyline,


      featuredATS,


      featuredTotal,


      status:
        new Date() >= new Date(competition.date)
          ? "Locked"
          : "Open",

    }),
  });



  const result =
    await response.json();



 



  if (response.ok) {

    setSaved(true);


    setTimeout(() => {
      setSaved(false);
    }, 2000);


  } else {

    alert(
      result.error ||
      result.message ||
      "Failed to save pick."
    );

  }
};
  return (
    <div>
        <h2
  style={{
    marginBottom: 20,
  }}
>
  NFL Games
</h2>

<div
  style={{
    display: "grid",
    gap: 12,
    marginBottom: 40,
    maxHeight: 500,
    overflowY: "auto",
  }}
>
  {games.map((game) => (
  <GameCard
    key={game.id}
    game={game}
    selected={selectedGameId === game.id}
    onClick={() => {
      setSelectedGameId(game.id);

      const existing = existingPicks?.find(
        (pick: any) =>
          pick.gameId === game.id
      );

      if (existing) {
        setMoneylinePick(
          existing.moneylinePick || ""
        );

        setAtsPick(
          existing.atsPick || ""
        );

        setSpread(
          existing.spread?.toString() || ""
        );

        setConfidence(
          existing.confidence || 90
        );

        setAnalysis(
          existing.analysis || ""
        );

        setTotalLine(
          existing.totalLine?.toString() || ""
        );

        setTotalPick(
          existing.totalPick || ""
        );

        setFeaturedMoneyline(
          Boolean(existing.featuredMoneyline)
        );

        setFeaturedATS(
          Boolean(existing.featuredATS)
        );

        setFeaturedTotal(
          Boolean(existing.featuredTotal)
        );
      } else {
        setMoneylinePick("");
        setAtsPick("");
        setSpread("");
        setConfidence(90);
        setAnalysis("");
        setTotalLine("");
        setTotalPick("");
        setFeaturedMoneyline(false);
        setFeaturedATS(false);
        setFeaturedTotal(false);
      }

      setTimeout(() => {
        editorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }}
  />
))}
</div>
      
      {selectedGame && (
  <div
    ref={editorRef}
          style={{
            animation: "slideUp .35s ease",
            padding: 20,
            background: "#1e293b",
            borderRadius: 12,
            border: "1px solid #334155",
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 8,
            }}
          >
            {away?.team.displayName} @ {home?.team.displayName}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: 25,
            }}
          >
            Select your Moneyline pick.
          </p>

          <div
            style={{
              display: "grid",
              gap: 15,
            }}
          >
            {[away, home].map((team: any) => {
              const selected =
                moneylinePick === team.team.displayName;

              return (
                <div
                  key={team.team.id}
                  onClick={() =>
                    setMoneylinePick(team.team.displayName)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: 18,
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "0.2s",
                    background: selected
                      ? "#22c55e"
                      : "#172036",
                    border: selected
                      ? "2px solid #4ade80"
                      : "2px solid #334155",
                  }}
                >
                  <img
  src={team.team.logo}
  alt={team.team.displayName}
  width={56}
  height={56}
  style={{
    objectFit: "contain",
    flexShrink: 0,
  }}
/>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {team.team.displayName}
                  </div>
                </div>
              );
            })}
          </div>

          {moneylinePick && (
            
            <div
              style={{
                marginTop: 20,
                color: "#4ade80",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              ✓ Moneyline Pick: {moneylinePick}
            </div>
          )}
          <div
  style={{
    padding: 20,
    background: "#1e293b",
    borderRadius: 12,
    border: "1px solid #334155",
    marginTop: 30,
  }}
>
  <h2
    style={{
      marginTop: 0,
      marginBottom: 8,
    }}
  >
    Select ATS Pick
  </h2>

  <p
    style={{
      color: "#94a3b8",
      marginBottom: 25,
    }}
  >
    Choose against the spread.
  </p>

  <div
    style={{
      display: "grid",
      gap: 15,
    }}
  >
    {[away, home].map((team: any) => {
      const selected =
        atsPick === team.team.displayName;


      return (
        <div
          key={team.team.id + "-ats"}
          onClick={() =>
            setAtsPick(team.team.displayName)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: 18,
            borderRadius: 14,
            cursor: "pointer",
            transition: ".2s",
            background: selected
              ? "#22c55e"
              : "#172036",
            border: selected
              ? "2px solid #4ade80"
              : "2px solid #334155",
          }}
        >
          <img
  src={team.team.logo}
  alt={team.team.displayName}
  width={56}
  height={56}
  style={{
    objectFit: "contain",
    flexShrink: 0,
  }}
/>

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {team.team.displayName}
            </div>
          </div>

          <div
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {spread}
          </div>
        </div>
      );
    })}
  </div>

  {atsPick && (
    <div
      style={{
        marginTop: 20,
        color: "#4ade80",
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      ✓ ATS Pick: {atsPick}
      <div
  style={{
    marginTop: 20,
    marginBottom: 25,
  }}
>
  <div
    style={{
      color: "white",
      fontWeight: 700,
      marginBottom: 8,
    }}
  >
    Spread
  </div>

  <input
    type="number"
    step="0.5"
    value={spread}
    onChange={(e) => setSpread(e.target.value)}
    placeholder="Example: -3.5 or 3.5"
    style={{
      width: 180,
      padding: 12,
      borderRadius: 8,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "white",
      fontSize: 16,
    }}
  />
</div>
    </div>
  )}
  {/* CONFIDENCE */}
<div
  style={{
    marginTop: 30,
    paddingTop: 30,
    borderTop: "1px solid #334155",
  }}
>
  <h2
    style={{
      marginBottom: 15,
      color: "white",
    }}
  >
    Total (Over / Under)
  </h2>

  <input
    type="number"
    step="0.5"
    placeholder="Example: 47.5"
    value={totalLine}
    onChange={(e) => setTotalLine(e.target.value)}
    style={{
      width: 150,
      padding: 10,
      borderRadius: 8,
      border: "1px solid #334155",
      background: "#0f172a",
      color: "white",
      marginBottom: 20,
    }}
  />

  <div
    style={{
      display: "flex",
      gap: 15,
    }}
  >
    {["Over", "Under"].map((pick) => (
      <button
        key={pick}
        onClick={() => setTotalPick(pick)}
        style={{
          padding: "12px 24px",
          borderRadius: 10,
          border:
            totalPick === pick
              ? "2px solid #4ade80"
              : "2px solid #334155",
          background:
            totalPick === pick
              ? "#22c55e"
              : "#172036",
          color: "white",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {pick}
      </button>
    ))}
  </div>

  {totalPick && (
    <div
      style={{
        marginTop: 15,
        color: "#4ade80",
        fontWeight: 700,
      }}
    >
      ✓ {totalPick} {totalLine}
    </div>
  )}
</div>
<div
  style={{
    marginTop: 40,
    marginBottom: 30,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
      fontWeight: 700,
      color: "white",
    }}
  >
    <span>Confidence</span>
    <span>{confidence}%</span>
  </div>

  <input
    type="range"
    min={50}
    max={100}
    value={confidence}
    onChange={(e) =>
      setConfidence(Number(e.target.value))
    }
    style={{
      width: "100%",
      cursor: "pointer",
    }}
  />

  <div
    style={{
      marginTop: 12,
      height: 12,
      borderRadius: 999,
      overflow: "hidden",
      background: "#0f172a",
    }}
  >
    <div
      style={{
        width: `${confidence}%`,
        height: "100%",
        borderRadius: 999,
        transition: ".2s",

        background:
          confidence < 60
            ? "#ef4444"
            : confidence < 70
            ? "#f97316"
            : confidence < 80
            ? "#eab308"
            : confidence < 90
            ? "#22c55e"
            : "#16a34a",
      }}
    />
  </div>
</div>

<div
  style={{
    display: "flex",
    gap: 20,
    alignItems: "center",
  }}
>
 <div
  style={{
    marginBottom: 30,
  }}
>
  <div
    style={{
      color: "white",
      fontWeight: 700,
      marginBottom: 10,
    }}
  >

<div
  style={{
    marginBottom: 30,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  }}
>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={featuredMoneyline}
      onChange={(e) =>
        setFeaturedMoneyline(e.target.checked)
      }
    />

    ⭐ Featured Moneyline Pick of the Week
  </label>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={featuredATS}
      onChange={(e) =>
        setFeaturedATS(e.target.checked)
      }
    />

    🏈 Featured ATS Pick of the Week
  </label>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={featuredTotal}
      onChange={(e) =>
        setFeaturedTotal(e.target.checked)
      }
    />

    📈 Featured Total Pick of the Week
  </label>
</div>

    Pick Analysis
  </div>

  <textarea
    value={analysis}
    onChange={(e) => setAnalysis(e.target.value)}
    rows={8}
    placeholder="Write your reasoning for this pick..."
    style={{
      width: "100%",
      background: "#0f172a",
      color: "white",
      border: "1px solid #334155",
      borderRadius: 10,
      padding: 16,
      resize: "vertical",
      fontSize: 16,
      lineHeight: 1.6,
      outline: "none",
    }}
  />
</div>
 <button
  onClick={handleSave}
  style={{
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: 10,
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  💾 Save Pick
</button>

  {saved && (
    <span
      style={{
        color: "#4ade80",
        fontWeight: "bold",
        fontSize: 18,
      }}
    >
      ✓ Pick Saved
    </span>
  )}
</div>
</div>
        </div>
            )}
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}