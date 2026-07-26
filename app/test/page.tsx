import { getNFLSchedule } from "../../lib/api/nfl";

export default async function TestPage() {
  const data = await getNFLSchedule();

  return (
    <main
      style={{
        color: "white",
        padding: 40,
      }}
    >
      <pre>
        {JSON.stringify(data.events[0], null, 2)}
      </pre>
    </main>
  );
}