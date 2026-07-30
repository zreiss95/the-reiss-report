import Link from "next/link";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const positions = [
  {
    name: "Quarterbacks",
    short: "QB",
    color: "#2563eb",
  },
  {
    name: "Running Backs",
    short: "RB",
    color: "#16a34a",
  },
  {
    name: "Wide Receivers",
    short: "WR",
    color: "#ea580c",
  },
  {
    name: "Tight Ends",
    short: "TE",
    color: "#9333ea",
  },
  {
    name: "Kickers",
    short: "K",
    color: "#ca8a04",
  },
  {
    name: "Defense / Special Teams",
    short: "DEF",
    color: "#dc2626",
  },
];

export default function PlayerRankingsLandingPage() {
  return (
    <main
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "40px 24px",
        color: "white",
      }}
        >
      <div style={{ marginBottom: 20 }}>
        <BackButton />
      </div>

      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        🏈 Player Rankings
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: 40,
          fontSize: 18,
        }}
      >
        Choose a position.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 22,
        }}
      >
        {positions.map((position) => (
          <Link
            key={position.short}
            href={`/rankings/players/${position.short}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: 16,
                border: "1px solid #24314f",
                padding: 28,
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 6,
                  borderRadius: 100,
                  background: position.color,
                  marginBottom: 24,
                }}
              />

              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {position.short}
              </h2>

              <p
                style={{
                  marginTop: 12,
                  color: "#94a3b8",
                  fontSize: 17,
                }}
              >
                {position.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}