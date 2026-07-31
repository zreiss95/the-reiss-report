import { cookies } from "next/headers";
import { verifyAdminSession } from "./session";


export async function isAdminAuthenticated() {

  const cookieStore = await cookies();


  const authCookie =
    cookieStore.get("admin-auth");


  if (!authCookie?.value) {
    return false;
  }


  return verifyAdminSession(
    authCookie.value
  );

}