import { notFound } from "next/navigation";

import RankingBoard from "@/lib/components/RankingBoard";
import { getRankings } from "@/lib/db/playerRankings";

const VALID_POSITIONS = [
  "QB",
  "RB",
  "WR",
  "TE",
  "K",
  "DEF",
];

export default function PlayerPositionPage({
  params,
}: {
  params: {
    position: string;
  };
}) {
  const position = params.position.toUpperCase();

  if (!VALID_POSITIONS.includes(position)) {
    notFound();
  }

const rankings = getRankings(position);

  return (
    <main
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        padding: "40px 24px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        🏈 {position} Rankings
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: 30,
          fontSize: 18,
        }}
      >
        NFL.com vs Your Rankings
      </p>

      <RankingBoard
        position={position}
        rankings={rankings}
      />
    </main>
  );
}