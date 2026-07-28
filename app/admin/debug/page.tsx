import { supabase } from "@/lib/supabase";

export default async function DebugPage() {

  const { data: players, error } = await supabase
    .from("players")
    .select(`
      name,
      team,
      position
    `)
    .limit(10);


  return (
    <div style={{ padding: 20 }}>

      <h1>
        Database Debug
      </h1>


      {error && (
        <pre>
          {error.message}
        </pre>
      )}


      <pre>
        {JSON.stringify(
          players,
          null,
          2
        )}
      </pre>

    </div>
  );
}