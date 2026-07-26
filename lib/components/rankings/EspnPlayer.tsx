"use client";

export default function EspnPlayer({
  player,
}: {
  player: any;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        marginBottom: 8,
        background: "#172036",
        borderRadius: 12,
        border: "1px solid #24314f",
      }}
    >
      <div
        style={{
          width: 30,
          fontWeight: 800,
          color: "#94a3b8",
        }}
      >
        {player.consensusRank}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
          }}
        >
          {player.player}
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          {player.team}
        </div>
      </div>
    </div>
  );
}