import Link from "next/link";
import FeatureCard from "../lib/components/FeatureCard";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080B0F",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hero */}

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 24px 50px",
        }}
      >



        <h1
          style={{
            fontSize: 54,
            marginBottom: 12,
            fontWeight: 800,
          }}
        >
          🏈 The Reiss Report
        </h1>

        <p
          style={{
            color: "#A0AEC0",
            fontSize: 22,
            marginBottom: 30,
          }}
        >
          NFL Picks • Survivor • Best Bets • Rankings • Fantasy
        </p>

        <div
          style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <Link href="/weekly-picks">
            <button
              style={{
                background: "#16A34A",
                color: "white",
                padding: "14px 24px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Weekly Picks
            </button>
          </Link>

          <Link href="/rankings">
            <button
              style={{
                background: "#1E293B",
                color: "white",
                padding: "14px 24px",
                borderRadius: 10,
                border: "1px solid #334155",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Power Rankings
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 35px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {[
            ["Overall Record", "0-0"],
            ["Best Bets", "0-0"],
            ["Survivor", "0-0"],
            ["ATS Record", "0-0"],
          ].map(([title, value]) => (
            <div
              key={title}
              style={{
                background: "#111827",
                border: "1px solid #1F2937",
                borderRadius: 14,
                padding: 25,
              }}
            >
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 14,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  marginTop: 10,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <h2
          style={{
            fontSize: 34,
            marginBottom: 25,
          }}
        >
          Everything You Need
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          <FeatureCard
            title="Weekly Picks"
            description="Weekly NFL game predictions against the spread and straight up."
            href="/weekly-picks"
          />

          <FeatureCard
            title="Survivor Picks"
            description="Safest survivor selections every NFL week."
            href="/survivor"
          />

          <FeatureCard
            title="Loser Survivor"
            description="Reverse survivor selections each week."
            href="/loser-survivor"
          />

          <FeatureCard
            title="Power Rankings"
            description="Rankings including QB, RB, WR, TE, K, DEF and Team Rankings."
            href="/rankings"
          />

          <FeatureCard
            title="Fantasy Rankings"
            description="Fantasy football rankings, ADP comparisons, tiers and draft boards."
            href="/fantasy"
          />

          <FeatureCard
            title="DFS"
            description="Daily Fantasy tools and projections."
            disabled
          />
        </div>
      </section>
    </main>
  );
}