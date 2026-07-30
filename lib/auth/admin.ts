import { createClient } from "@/lib/supabase/server";


export async function isAdminAuthenticated() {

  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    return false;
  }


  const {
    data: profile,
    error,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id
      )
      .single();


  if (error || !profile) {
    return false;
  }


  return profile.role === "admin";

}