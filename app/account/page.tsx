import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountPage() {

  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    redirect("/login");
  }


  const {
    data: profile,
  } =
    await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        user.id
      )
      .single();


  return (
    <main
      style={{
        maxWidth:600,
        margin:"60px auto",
        padding:20,
        color:"white",
      }}
    >

      <h1
        style={{
          fontSize:36,
          marginBottom:25,
        }}
      >
        Account
      </h1>


      <div
        style={{
          background:"#111827",
          border:"1px solid #24314f",
          borderRadius:16,
          padding:25,
        }}
      >

        <h2
          style={{
            marginBottom:20,
          }}
        >
          Profile
        </h2>


        <p
          style={{
            color:"#94a3b8",
            marginBottom:10,
          }}
        >
          Email
        </p>

        <p
          style={{
            fontSize:18,
            marginBottom:20,
          }}
        >
          {user.email}
        </p>


        <p
          style={{
            color:"#94a3b8",
            marginBottom:10,
          }}
        >
          Account Type
        </p>


        <p
          style={{
            fontSize:18,
            marginBottom:20,
          }}
        >
          {profile?.role || "user"}
        </p>


        <p
          style={{
            color:"#94a3b8",
            marginBottom:10,
          }}
        >
          Member Since
        </p>


        <p
          style={{
            fontSize:18,
            marginBottom:30,
          }}
        >
          {profile?.created_at
            ? new Date(profile.created_at)
                .toLocaleDateString()
            : "Unknown"}
        </p>


        <LogoutButton />

      </div>

    </main>
  );
}