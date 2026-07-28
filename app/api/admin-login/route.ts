import { NextResponse } from "next/server";
import { setCsrfToken } from "@/lib/auth/csrf";
import { createAdminSession } from "@/lib/auth/session";
import {
  checkLoginLock,
  recordFailedLogin,
  clearFailedLogin,
} from "@/lib/auth/loginSecurity";


export async function POST(req: Request) {

  try {

    const body =
      await req.json();



    const username =
      String(body.username ?? "")
        .trim();


    const password =
      String(body.password ?? "");



    if (!username || !password) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    const forwardedFor =
      req.headers.get("x-forwarded-for");


    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";



    const locked =
      await checkLoginLock(ip);



    if (locked) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many failed attempts. Try again later.",
        },
        {
          status: 429,
        }
      );

    }



    const validCredentials =
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD;



    if (!validCredentials) {

      await recordFailedLogin(ip);


      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    await clearFailedLogin(ip);



    const session =
      createAdminSession();



    const response =
      NextResponse.json({
        success: true,
      });



    response.cookies.set(
      "admin-auth",
      session,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "strict",

        maxAge:
          60 * 60 * 8,

        expires:
          new Date(
            Date.now() +
            60 * 60 * 8 * 1000
          ),

        path: "/",
      }
    );



    await setCsrfToken();



    return response;



  } catch (err: any) {

    console.error(
      "Admin login error:",
      err
    );


    return NextResponse.json(
      {
        success: false,
        message: "Login failed.",
      },
      {
        status: 500,
      }
    );

  }

}