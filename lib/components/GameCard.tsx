"use client";

type GameCardProps = {
  game: any;
  selected: boolean;
  onClick: () => void;
};

export default function GameCard({
  game,
  selected,
  onClick,
}: GameCardProps) {
  const competition = game.competitions?.[0];

  const home = competition?.competitors.find(
    (c: any) => c.homeAway === "home"
  );

  const away = competition?.competitors.find(
    (c: any) => c.homeAway === "away"
  );

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? "#22c55e" : "#172036",
        border: selected
          ? "2px solid #4ade80"
          : "1px solid #334155",
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
        cursor: "pointer",
        transition: ".2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <img
          src={away.team.logo}
          width={36}
          height={36}
          alt={away.team.displayName}
        />

        <strong style={{ fontSize: 18 }}>
          {away.team.displayName}
        </strong>

        <span style={{ color: "#94a3b8" }}>@</span>

        <img
          src={home.team.logo}
          width={36}
          height={36}
          alt={home.team.displayName}
        />

        <strong style={{ fontSize: 18 }}>
          {home.team.displayName}
        </strong>
      </div>
    </div>
  );
}