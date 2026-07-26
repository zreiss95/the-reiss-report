type Props = {
  stats: {
    moneyline: {
      wins: number;
      losses: number;
      total: number;
      pct: number;
    };
    ats: {
      wins: number;
      losses: number;
      pushes: number;
      total: number;
      pct: number;
    };
  };
};

export default function SeasonRecord({ stats }: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg,#172036,#111827)",
        border: "1px solid #2b3b60",
        borderRadius: 22,
        padding: "28px 24px",
        margin: "30px 0",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 18px 40px rgba(0,0,0,.35)",
      }}
    >
      {/* Moneyline */}

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          Moneyline Record
        </div>

        <div
          style={{
            color: "#38bdf8",
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {stats.moneyline.wins}-{stats.moneyline.losses}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "6px 14px",
            borderRadius: 999,
            background: "#1e3a5f",
            color: "#7dd3fc",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {stats.moneyline.pct}%
        </div>

        
      </div>

      {/* Divider */}

      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "#24314f",
          margin: "0 24px",
        }}
      />

      {/* ATS */}

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          ATS Record
        </div>

        <div
          style={{
            color: "#22c55e",
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {stats.ats.wins}-{stats.ats.losses}
          {stats.ats.pushes ? `-${stats.ats.pushes}` : ""}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "6px 14px",
            borderRadius: 999,
            background: "#17462a",
            color: "#4ade80",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {stats.ats.pct}%
        </div>

        
      </div>
    </div>
  );
}