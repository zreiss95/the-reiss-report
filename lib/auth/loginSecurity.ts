import { supabase } from "@/lib/supabase";


const MAX_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;



export async function checkLoginLock(
  ip: string
) {

  const {
    data,
    error,
  } = await supabase
    .from("admin_login_attempts")
    .select("*")
    .eq("ip", ip)
    .single();



  if (error || !data) {
    return false;
  }



  if (!data.lockedUntil) {
    return false;
  }



  const lockedUntil =
    new Date(
      data.lockedUntil
    ).getTime();



  return (
    lockedUntil >
    Date.now()
  );

}



export async function recordFailedLogin(
  ip: string
) {

  const {
    data,
  } = await supabase
    .from("admin_login_attempts")
    .select("*")
    .eq("ip", ip)
    .single();



  const attempts =
    (data?.attempts ?? 0) + 1;



  let lockedUntil =
    data?.lockedUntil ?? null;



  if (attempts >= MAX_ATTEMPTS) {

    lockedUntil =
      new Date(
        Date.now() +
        LOCK_TIME_MINUTES * 60 * 1000
      ).toISOString();

  }



  const {
    error,
  } = await supabase
    .from("admin_login_attempts")
    .upsert(
      {
        ip,

        attempts,

        lockedUntil,

        updatedAt:
          new Date().toISOString(),

      },
      {
        onConflict: "ip",
      }
    );



  if (error) {
    throw error;
  }

}



export async function clearFailedLogin(
  ip: string
) {

  const {
    error,
  } = await supabase
    .from("admin_login_attempts")
    .delete()
    .eq(
      "ip",
      ip
    );



  if (error) {
    throw error;
  }

}