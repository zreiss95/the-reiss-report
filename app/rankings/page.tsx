import Link from "next/link";

const cards = [
  {
    title: "Player Rankings",
    description:
      "QB, RB, WR, TE, K and DEF rankings with consensus comparisons and custom rankings.",
    href: "/rankings/players",
    color: "#2563eb",
  },
  {
    title: "Team Rankings",
    description:
      "Complete NFL power rankings with consensus comparison and your own custom rankings.",
    href: "/rankings/team",
    color: "#16a34a",
  },
];

export default function RankingsHome() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 24px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        🏆 NFL Rankings
      </h1>

      <p
        style={{
          color: "#94a3b8",
          fontSize: 18,
          marginBottom: 40,
        }}
      >
        Choose the rankings you'd like to explore.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
          gap: 24,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "#111827",
                border: "1px solid #1f2937",
                borderRadius: 16,
                padding: 28,
                transition: ".2s",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 6,
                  borderRadius: 999,
                  background: card.color,
                  marginBottom: 20,
                }}
              />

              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 12,
                  color: "white",
                }}
              >
                {card.title}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}