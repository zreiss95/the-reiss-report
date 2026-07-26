"use client";

import Image from "next/image";
import { useState } from "react";

type PickCardProps = {
  away: string;
  awayLogo: string;
  home: string;
  homeLogo: string;

  moneylinePick: string;
 atsPick: string;

  totalPick?: string;
  totalLine?: number;

  confidence: number;

  line: string;
  status: string;
  analysis: string;

  moneylineResult: string;
  atsResult: string;

  homeScore?: number;
  awayScore?: number;
};

export default function PickCard({
  away,
  awayLogo,
  home,
  homeLogo,
  moneylinePick,
  atsPick,

  totalPick,
  totalLine,

  confidence,
  line,
  status,
  analysis,
  moneylineResult,
  atsResult,
  homeScore,
  awayScore,
}: PickCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "#172036",
        border: "1px solid #24314f",
        borderRadius: 18,
        padding: 28,
        marginBottom: 24,
        cursor: "pointer",
        transition: "all .25s ease",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Image
            src={awayLogo}
            alt={away}
            width={42}
            height={42}
          />

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 25,
                fontWeight: 700,
              }}
            >
              {away} @ {home}
            </h2>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Weekly Pick
            </div>
          </div>

          <Image
            src={homeLogo}
            alt={home}
            width={42}
            height={42}
          />
        </div>

        <div
          style={{
            fontSize: 28,
            transition: "transform .25s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            color: "#94a3b8",
            fontWeight: 700,
          }}
        >
          ▼
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 30 }}>

          {/* MONEYLINE */}

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 10,
                color: "#cbd5e1",
              }}
            >
              Moneyline
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "#2563eb",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {moneylinePick}
              </span>

              {moneylineResult && (
                <span
                  style={{
                    background:
                      moneylineResult === "WIN"
                        ? "#16a34a"
                        : moneylineResult === "LOSS"
                        ? "#dc2626"
                        : "#64748b",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: ".5px",
                  }}
                >
                  {moneylineResult}
                </span>
              )}
            </div>
          </div>

          {/* ATS */}

          <div style={{ marginBottom: 30 }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 10,
                color: "#cbd5e1",
              }}
            >
              Against the Spread
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "#16a34a",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {atsPick}
              </span>

              {atsResult && (
                <span
                  style={{
                    background:
                      atsResult === "WIN"
                        ? "#16a34a"
                        : atsResult === "LOSS"
                        ? "#dc2626"
                        : "#64748b",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: ".5px",
                  }}
                >
                  {atsResult}
                </span>
              )}
            </div>
          </div>

{/* TOTAL */}

{totalPick && (
  <div style={{ marginBottom: 30 }}>
    <div
      style={{
        fontWeight: 700,
        marginBottom: 10,
        color: "#cbd5e1",
      }}
    >
      Total
    </div>

    <span
      style={{
        display: "inline-block",
        background: "#9333ea",
        color: "white",
        padding: "10px 18px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      {totalPick} {totalLine}
    </span>
  </div>
)}

          {/* CONFIDENCE */}

          <div style={{ marginBottom: 28 }}>
            <div
              style={{
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
                  transition: ".25s",
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

            <div
              style={{
                marginTop: 8,
                textAlign: "right",
                color: "#94a3b8",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {confidence}% Confidence
            </div>
          </div>

          {/* LOCK STATUS + KICKOFF */}

          {(status || line) && (
            <div
              style={{
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                color: "#94a3b8",
                fontSize: 15,
              }}
            >
              {status === "Locked" && (
                <span
                  style={{
                    background: "#334155",
                    color: "#e2e8f0",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  🔒 LOCKED
                </span>
              )}

              {line && (
                <span>
                  Kickoff: {line}
                </span>
              )}
            </div>
          )}

          {/* FINAL SCORE */}

          {homeScore != null && awayScore != null && (
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #24314f",
                borderRadius: 14,
                padding: "16px 20px",
                marginBottom: 26,
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                }}
              >
                Final Score
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                <span>
                  {away}
                </span>

                <span
                  style={{
                    fontSize: 28,
                  }}
                >
                  {awayScore}
                </span>
              </div>

              <div
                style={{
                  height: 1,
                  background: "#24314f",
                  margin: "12px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                <span>
                  {home}
                </span>

                <span
                  style={{
                    fontSize: 28,
                  }}
                >
                  {homeScore}
                </span>
              </div>
            </div>
          )}

          {/* ANALYSIS */}

          {analysis && (
            <div
              style={{
                borderTop: "1px solid #24314f",
                paddingTop: 20,
                color: "#d4d4d4",
                lineHeight: 1.8,
                fontSize: 16,
              }}
            >
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}