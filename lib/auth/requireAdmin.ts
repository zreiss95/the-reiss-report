import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCsrfToken } from "@/lib/auth/csrf";
import { verifyAdminSession } from "@/lib/auth/session";


export async function requireAdmin(
  req: NextRequest
) {

  try {

    const cookieStore =
      await cookies();



    const session =
      cookieStore.get("admin-auth")?.value;



    if (!session) {
      return NextResponse.json(
        {
          success:false,
          error:"Unauthorized",
        },
        {
          status:401,
        }
      );
    }



    const validSession =
      verifyAdminSession(session);



    if (!validSession) {
      return NextResponse.json(
        {
          success:false,
          error:"Unauthorized",
        },
        {
          status:401,
        }
      );
    }



    const csrfToken =
      req.headers.get(
        "x-csrf-token"
      );



    const validCsrf =
      await verifyCsrfToken(csrfToken);



    if (!validCsrf) {
      return NextResponse.json(
        {
          success:false,
          error:"Invalid CSRF token",
        },
        {
          status:403,
        }
      );
    }



    return null;



  } catch (err) {

    console.error(
      "Admin authentication error:",
      err
    );


    return NextResponse.json(
      {
        success:false,
        error:"Unauthorized",
      },
      {
        status:401,
      }
    );

  }

}