import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient();


  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();


  


  if (!user) {
    redirect("/login");
  }


const {
  data: profile,
  error: profileError,
} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();





  if (!profile) {
    return (
      <main
        style={{
          padding:40,
          color:"white",
        }}
      >
        <h1>
          Profile Missing
        </h1>

        <p>
          Your account exists but no profile row was found.
        </p>

        <pre>
          {JSON.stringify(profileError, null, 2)}
        </pre>
      </main>
    );
  }


  if (profile.role !== "admin") {
    return (
      <main
        style={{
          padding:40,
          color:"white",
        }}
      >
        <h1>
          Access Denied
        </h1>

        <p>
          Your account is not an admin account.
        </p>

        <p>
          Current role: {profile.role}
        </p>
      </main>
    );
  }


  return (
    <main
      style={{
        minHeight:"100vh",
        background:"#0f172a",
        color:"white",
      }}
    >

      <div
        style={{
          padding:20,
          borderBottom:"1px solid #24314f",
          display:"flex",
          gap:20,
          flexWrap:"wrap",
        }}
      >
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/weekly-picks">Weekly Picks</Link>
        <Link href="/admin/survivor">Survivor</Link>
        <Link href="/admin/loser-survivor">Loser Survivor</Link>
        <Link href="/admin/rankings">Player Rankings</Link>
        <Link href="/admin/team-rankings">Team Rankings</Link>
        <Link href="/admin/fantasy">Fantasy ADP</Link>
      </div>

      {children}

    </main>
  );
}