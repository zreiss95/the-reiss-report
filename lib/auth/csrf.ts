import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "admin-csrf-token";


export function createCsrfToken() {

  return crypto
    .randomBytes(32)
    .toString("hex");

}



export async function setCsrfToken() {

  const cookieStore =
    await cookies();


  const token =
    createCsrfToken();



  cookieStore.set(
    CSRF_COOKIE,
    token,
    {
      httpOnly: false,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge:
        60 * 60 * 8,

      path: "/",
    }
  );


  return token;

}



export async function verifyCsrfToken(
  token: string | null
) {

  if (!token) {
    return false;
  }



  const cookieStore =
    await cookies();



  const stored =
    cookieStore.get(
      CSRF_COOKIE
    )?.value;



  if (!stored) {
    return false;
  }



  const storedBuffer =
    Buffer.from(stored);



  const tokenBuffer =
    Buffer.from(token);



  if (
    storedBuffer.length !== tokenBuffer.length
  ) {
    return false;
  }



  return crypto.timingSafeEqual(
    storedBuffer,
    tokenBuffer
  );

}