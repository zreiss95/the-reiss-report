import { createClient } from "@/lib/supabase/server";

export default async function TestAuthPage() {

  const supabase = await createClient();

  const {
    data: {
      user,
    },
    error,
  } = await supabase.auth.getUser();


  return (
    <main
      style={{
        padding:40,
        color:"white",
      }}
    >

      <h1>
        Auth Test
      </h1>


      <pre>
        {JSON.stringify(
          {
            user,
            error,
          },
          null,
          2
        )}
      </pre>

    </main>
  );
}