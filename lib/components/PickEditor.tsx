"use client";

export default function PickEditor({
  away,
  home,
  moneylinePick,
  setMoneylinePick,
  atsPick,
  setAtsPick,
}: any) {
  return (
    <>
      <div
        style={{
          padding: 20,
          background: "#1e293b",
          borderRadius: 12,
          border: "1px solid #334155",
          marginBottom: 30,
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {away.team.displayName} @ {home.team.displayName}
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
                  width={56}
                  height={56}
                  alt={team.team.displayName}
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
      </div>
    </>
  );
}