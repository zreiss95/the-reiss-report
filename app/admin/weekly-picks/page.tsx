import { getWeekGames } from "../../../lib/api/getWeekGames";
import { getPicks } from "../../../lib/db/picks";
import AdminEditor from "../../../lib/components/AdminEditor";
import { isAdminAuthenticated } from "../../../lib/auth/admin";
import { redirect } from "next/navigation";


export default async function WeeklyPicksAdmin({
  searchParams,
}: {
  searchParams: {
    week?: string;
  };
}) {

  const authenticated =
    await isAdminAuthenticated();


  if (!authenticated) {
    redirect("/login");
  }


  const selectedWeek =
    Number(searchParams.week) || 1;


  const games =
    await getWeekGames(selectedWeek);


  const existingPicks =
    await getPicks(selectedWeek);



  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >

      <h1
        style={{
          fontSize: 48,
          marginBottom: 10,
        }}
      >
        Weekly Picks Admin
      </h1>


      <p
        style={{
          color: "#94a3b8",
          marginBottom: 25,
        }}
      >
        Manage picks for Week {selectedWeek}
      </p>


      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 30,
        }}
      >

        {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (

          <a
            key={week}
            href={`/admin/weekly-picks?week=${week}`}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              background:
                week === selectedWeek
                  ? "#2563eb"
                  : "#1e293b",
              color: "white",
              fontWeight: 700,
              transition: ".2s",
            }}
          >
            Week {week}
          </a>

        ))}

      </div>


      <div
        style={{
          background: "#172036",
          border: "1px solid #24314f",
          borderRadius: 18,
          padding: 30,
        }}
      >

        <AdminEditor
          games={games}
          existingPicks={existingPicks}
        />

      </div>

    </main>
  );
}